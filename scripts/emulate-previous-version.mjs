#!/usr/bin/env node
/**
 * Browse real nav.no pages as a "previous version" user would see them.
 *
 * Every HTML document from *.nav.no is intercepted, and its decorator fragments
 * (header, footer, scripts, head assets) are replaced with the ones rendered by
 * the internal pod for --version, fetched via /dekoratoren/ssr?version-id=<sha>.
 * The page then carries the old VERSION_ID and the old CDN bundle, so every
 * client API call goes main pod -> version proxy -> nav-dekoratoren-<sha>,
 * exactly like a user on a page rendered before the last deploy.
 *
 * Usage:
 *   node scripts/emulate-previous-version.mjs [--version <40-char sha>] [--url <url>] [--check]
 *
 *   --version  Defaults to the previous release/prod@* tag.
 *   --url      Defaults to https://www.nav.no/
 *   --check    Headless: load the page, report what was served, and exit.
 *
 * A persistent browser profile (.emulate-previous-profile/) keeps you logged in between runs.
 */
import { execSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { chromium } from '@playwright/test';

const DECORATOR_URL = 'https://www.nav.no/dekoratoren';
const CDN_ASSETS = '/nav-dekoratoren/public/assets/';

const { values: args } = parseArgs({
	options: {
		version: { type: 'string' },
		url: { type: 'string', default: 'https://www.nav.no/' },
		check: { type: 'boolean', default: false },
	},
});

const previousReleaseSha = () => {
	const tag = execSync("git tag -l 'release/prod@*' --sort=-creatordate", { encoding: 'utf8' }).split('\n')[1];
	if (!tag) throw new Error('No previous release/prod@* tag found - pass --version');
	return execSync(`git rev-list -n1 ${tag}`, { encoding: 'utf8' }).trim();
};

const versionId = args.version ?? previousReleaseSha();
if (!/^[a-f0-9]{40}$/.test(versionId)) {
	throw new Error(`--version must be a full 40-char commit sha, got "${versionId}"`);
}

// The proxy silently falls back to the current version when the internal pod is gone,
// so confirm the pod for this version is actually answering.
const versionRes = await fetch(`${DECORATOR_URL}/api/version?version-id=${versionId}`).then((r) => r.json());
if (versionRes.localVersion !== versionId) {
	console.error(
		`No live internal pod for ${versionId} (served by ${versionRes.localVersion} instead). It may have expired (ttlInternal) or never been deployed as "previous".`
	);
	process.exit(1);
}
console.log(`Emulating decorator ${versionId} (current: ${versionRes.latestVersion})`);

const context = await chromium.launchPersistentContext('.emulate-previous-profile', {
	headless: args.check,
	// Installed Chrome rather than Playwright's bundled browser, so no download is needed
	channel: 'chrome',
	// The swapped inline scripts no longer match whatever the consumer's CSP allows
	bypassCSP: true,
	viewport: null,
});

// A blank page used only for DOMParser-based surgery on intercepted documents
const scratch = await context.newPage();

const getSsrFragments = async (rawParams, origin) => {
	const url = new URL(`${DECORATOR_URL}/ssr`);
	for (const [key, value] of Object.entries(rawParams ?? {})) {
		url.searchParams.set(key, typeof value === 'string' ? value : JSON.stringify(value));
	}
	url.searchParams.set('version-id', versionId);
	const res = await fetch(url, { headers: { origin } });
	if (!res.ok) throw new Error(`/ssr for ${versionId} responded ${res.status}`);
	const fragments = await res.json();
	if (fragments.versionId !== versionId) {
		throw new Error(`/ssr was served by ${fragments.versionId}, not ${versionId}`);
	}
	return fragments;
};

const swapDecorator = (html, fragments) =>
	scratch.evaluate(
		({ html, fragments, cdnAssets }) => {
			const doc = new DOMParser().parseFromString(html, 'text/html');
			const replace = (selector, newHtml) => {
				const el = doc.querySelector(selector);
				if (!el) return false;
				el.outerHTML = newHtml;
				return true;
			};

			const swapped = {
				header: replace('#decorator-header', fragments.header),
				footer: replace('#decorator-footer', fragments.footer),
			};

			// Scripts: __DECORATOR_DATA__, the inline parser and the CDN bundle
			const data = doc.getElementById('__DECORATOR_DATA__');
			swapped.scripts = !!data;
			if (data) {
				// Remove the current ones first, so a bundle with an unchanged hash isn't duplicated
				doc.getElementById('d-data-parser')?.remove();
				doc.querySelectorAll(`script[src*="${cdnAssets}"]`).forEach((el) => el.remove());
				data.insertAdjacentHTML('beforebegin', fragments.scripts);
				data.remove();
			}

			// Head: put the old head assets where the current decorator stylesheet was, so the
			// cascade order relative to the consumer's own CSS is unchanged (navno-frontend loads
			// the decorator CSS before its own). Then drop the current decorator links (CSS,
			// icons, manifest), which the old head assets include.
			const currentLinks = [...doc.head.querySelectorAll(`link[href*="/nav-dekoratoren/public/"]`)];
			const anchor = currentLinks.find((el) => el.getAttribute('href').includes(cdnAssets)) ?? currentLinks[0];
			const marker = doc.createComment('emulated-decorator-head-assets');
			if (anchor) anchor.before(marker);
			else doc.head.append(marker);
			currentLinks.forEach((el) => el.remove());
			const template = doc.createElement('template');
			template.innerHTML = fragments.headAssets;
			marker.replaceWith(...template.content.childNodes);

			const doctype = doc.doctype ? `<!DOCTYPE ${doc.doctype.name}>` : '';
			return { html: doctype + doc.documentElement.outerHTML, swapped };
		},
		{ html, fragments, cdnAssets: CDN_ASSETS }
	);

await context.route(
	(url) => url.hostname === 'nav.no' || url.hostname.endsWith('.nav.no'),
	async (route) => {
		if (route.request().resourceType() !== 'document') return route.fallback();

		const response = await route.fetch();
		const contentType = response.headers()['content-type'] ?? '';
		if (!contentType.includes('text/html')) return route.fulfill({ response });

		const html = await response.text();
		const match = html.match(/<script[^>]*id="__DECORATOR_DATA__"[^>]*>(.*?)<\/script>/s);
		if (!match) return route.fulfill({ response, body: html });

		try {
			const { rawParams, env } = JSON.parse(match[1]);
			const origin = new URL(route.request().url()).origin;
			const fragments = await getSsrFragments(rawParams, origin);
			const { html: swappedHtml, swapped } = await swapDecorator(html, fragments);
			console.log(`[swap] ${route.request().url()} ${env?.VERSION_ID} -> ${versionId}`, swapped);
			return route.fulfill({ response, body: swappedHtml });
		} catch (e) {
			console.error(`[swap failed] ${route.request().url()}: ${e}`);
			return route.fulfill({ response, body: html });
		}
	}
);

// Make it obvious which version this browser is pretending to be
await context.addInitScript((sha) => {
	addEventListener('DOMContentLoaded', () => {
		const badge = document.createElement('div');
		badge.textContent = `Emulating decorator ${sha.slice(0, 7)}`;
		badge.style.cssText =
			'position:fixed;bottom:8px;left:8px;z-index:2147483647;padding:4px 8px;font:12px monospace;background:#c30000;color:#fff;border-radius:4px;pointer-events:none';
		document.body.append(badge);
	});
}, versionId);

const page = await context.newPage();

const decoratorCalls = [];
page.on('response', (res) => {
	const url = new URL(res.url());
	if (url.href.startsWith(DECORATOR_URL) && url.searchParams.has('version-id')) {
		decoratorCalls.push({ path: url.pathname, versionId: url.searchParams.get('version-id'), status: res.status() });
		if (res.status() >= 400) console.warn(`[decorator ${res.status()}] ${url.pathname}`);
	}
});
page.on('pageerror', (err) => console.warn(`[pageerror] ${err.message}`));

await page.goto(args.url);

if (args.check) {
	await page.waitForLoadState('networkidle');
	const clientVersion = await page.evaluate(() => window.__DECORATOR_DATA__?.env?.VERSION_ID);
	const bundles = await page.evaluate(() =>
		[...document.querySelectorAll('script[src*="nav-dekoratoren"]')].map((el) => el.getAttribute('src'))
	);
	// In document order, to confirm the decorator CSS kept its place in the cascade
	const stylesheets = await page.evaluate(() =>
		[...document.querySelectorAll('link[rel="stylesheet"]')].map((el) => el.getAttribute('href'))
	);
	console.log({ clientVersion, bundles, stylesheets, decoratorCalls });
	await page.screenshot({ path: 'emulate-previous-version.png', fullPage: true });
	await context.close();
	process.exit(clientVersion === versionId ? 0 : 1);
}

console.log('Browse away. Close the browser window to exit.');
await new Promise((resolve) => context.on('close', resolve));
