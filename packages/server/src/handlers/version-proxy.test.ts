import { Hono } from 'hono';
import { register } from 'prom-client';
import { VERSION_ID_PARAM } from 'decorator-shared/constants';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { env } from '../env/server';
import type { versionProxyHandler as VersionProxyHandler } from './version-proxy';

// A valid-looking (but not necessarily real) short commit hash, matching the
// format versionProxyHandler requires before it will attempt to proxy.
const STALE_VERSION_ID = '1234567';
const METRIC_NAME = 'version_proxy_requests_total';
const FIVE_MINUTES = 5 * 60 * 1000;
const TEN_MINUTES = 10 * 60 * 1000;

// Node's fetch puts the errno in `cause`
const fetchError = (code: string) =>
	Object.assign(new TypeError('fetch failed'), {
		cause: Object.assign(new Error(`${code} internal-app`), { code }),
	});
const notFoundError = () => fetchError('ENOTFOUND');
const unreachableError = () => fetchError('ECONNREFUSED');

// Fresh module per test for its log state. The global prom-client registry survives resetModules.
const loadHandler = async (): Promise<typeof VersionProxyHandler> => {
	register.removeSingleMetric(METRIC_NAME);
	vi.resetModules();
	const mod = await import('./version-proxy');
	return mod.versionProxyHandler;
};

const buildApp = (handler: typeof VersionProxyHandler) => {
	const app = new Hono();
	app.use(handler);
	app.get('*', (c) => c.text('own pod response'));
	return app;
};

const requestWithVersion = (
	app: Hono,
	versionId: string,
	params?: Record<string, string>,
	init?: RequestInit,
	path = '/'
) => {
	const url = new URL(path, 'http://localhost');
	url.searchParams.set(VERSION_ID_PARAM, versionId);
	Object.entries(params ?? {}).forEach(([key, value]) => url.searchParams.set(key, value));
	return app.request(url.toString(), init);
};

const metricBreakdown = async () => {
	const metric = register.getSingleMetric(METRIC_NAME);
	const values = metric ? (await metric.get()).values : [];
	return values.map(({ labels, value }) => ({
		result: labels.result,
		origin: labels.origin,
		route: labels.route,
		value,
	}));
};

const metricValues = async () => {
	const totals: Record<string, number> = {};
	(await metricBreakdown()).forEach(({ result, value }) => {
		if (result === undefined) {
			throw new Error('Missing result metric label');
		}
		totals[result] = (totals[result] ?? 0) + value;
	});
	return totals;
};

describe('versionProxyHandler', () => {
	let warnSpy: ReturnType<typeof vi.spyOn>;
	let infoSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => undefined);
		warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		infoSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
		vi.useRealTimers();
	});

	const proxyLogs = (spy: ReturnType<typeof vi.spyOn>) =>
		spy.mock.calls
			.map((call: unknown[]) => String(call[0]))
			.filter((message: string) => message.includes('Version proxy:'));
	const parseMetaData = (log: string) => JSON.parse(JSON.parse(log).metaData);

	it('returns the proxied response and counts it', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('proxied response', { status: 200 })));

		const app = buildApp(await loadHandler());
		const res = await requestWithVersion(app, STALE_VERSION_ID);

		expect(await res.text()).toBe('proxied response');
		expect(await metricValues()).toEqual({ proxied: 1 });
		expect(await metricBreakdown()).toEqual([{ result: 'proxied', origin: 'unknown', route: 'other', value: 1 }]);
		expect(proxyLogs(warnSpy)).toHaveLength(0);
		expect(proxyLogs(infoSpy)).toHaveLength(0);
	});

	it('forwards a streamed POST body to the internal app', async () => {
		const fetchMock = vi.fn(async (url: string, init: RequestInit) => {
			const forwarded = new Request(url, init);
			return new Response(await forwarded.text());
		});
		vi.stubGlobal('fetch', fetchMock);

		const app = buildApp(await loadHandler());
		app.post('*', (c) => c.text('own pod response'));
		const res = await requestWithVersion(app, STALE_VERSION_ID, undefined, { method: 'POST', body: 'payload' });

		expect(await res.text()).toBe('payload');
		expect(fetchMock).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({ method: 'POST', duplex: 'half' })
		);
		expect(await metricValues()).toEqual({ proxied: 1 });
	});

	it('passes 5xx responses on and counts them as error_response', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('oops', { status: 503 })));

		const app = buildApp(await loadHandler());
		const res = await requestWithVersion(app, STALE_VERSION_ID);

		expect(res.status).toBe(503);
		expect(await metricValues()).toEqual({ error_response: 1 });
		expect(await metricBreakdown()).toEqual([
			{ result: 'error_response', origin: 'unknown', route: 'other', value: 1 },
		]);
		const logs = proxyLogs(infoSpy);
		expect(logs).toHaveLength(1);
		expect(logs[0]).toContain('responded with status 503');
		expect(parseMetaData(logs[0])).toEqual(expect.objectContaining({ result: 'error_response', status: 503 }));
	});

	it('serves its own response for unreachable internal apps and counts them', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(unreachableError()));

		const app = buildApp(await loadHandler());
		const res = await requestWithVersion(app, STALE_VERSION_ID, {
			origin: 'navno-frontend',
			pageType: 'Forside',
			decoratorModulerVersion: '4.3.0',
			decoratorModulerEntryPoint: 'ssr',
		});

		expect(await res.text()).toBe('own pod response');
		expect(await metricValues()).toEqual({ unreachable: 1 });
		const logs = proxyLogs(infoSpy);
		expect(logs).toHaveLength(1);
		expect(logs[0]).toContain('ECONNREFUSED');
		expect(logs[0]).toContain('origin: navno-frontend');
		expect(logs[0]).not.toMatch(/consecutive|first failure/);
		expect(JSON.parse(logs[0]).error).toContain('ECONNREFUSED internal-app');
		expect(parseMetaData(logs[0])).toEqual({
			result: 'unreachable',
			requestedVersion: STALE_VERSION_ID,
			servingVersion: env.VERSION_ID,
			persistent: false,
			path: '/',
			errorCode: 'ECONNREFUSED',
			origin: 'navno-frontend',
			pageType: 'Forside',
			decoratorModulerVersion: '4.3.0',
			decoratorModulerEntryPoint: 'ssr',
		});
	});

	it('serves its own response for versions without an internal app and counts them as not_found', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(notFoundError()));

		const app = buildApp(await loadHandler());
		const res = await requestWithVersion(app, STALE_VERSION_ID);

		expect(await res.text()).toBe('own pod response');
		expect(await metricValues()).toEqual({ not_found: 1 });
		expect(proxyLogs(infoSpy)[0]).toContain('no internal app exists for this version');
	});

	it('counts only bounded origins and routes across ingress prefixes', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(notFoundError()));

		const app = buildApp(await loadHandler());
		await requestWithVersion(app, STALE_VERSION_ID, { origin: 'navno-frontend' }, undefined, '/dekoratoren/auth');
		await requestWithVersion(app, STALE_VERSION_ID, { origin: 'navno-frontend' }, undefined, '/dekoratoren/auth/');
		await requestWithVersion(app, STALE_VERSION_ID, { origin: 'another-app' }, undefined, '/common-html/v4/navno/ssr');
		await requestWithVersion(app, STALE_VERSION_ID, undefined, undefined, '/header');
		await requestWithVersion(app, STALE_VERSION_ID, { origin: 'unknown-app' }, undefined, '/dekoratoren/footer');
		await requestWithVersion(app, STALE_VERSION_ID, undefined, undefined, '/common-html/v4/navno/api/consentping');
		await requestWithVersion(app, STALE_VERSION_ID, { origin: 'navno-frontend' }, undefined, '/other/auth');

		expect(await metricBreakdown()).toEqual([
			{ result: 'not_found', origin: 'navno-frontend', route: 'auth', value: 2 },
			{ result: 'not_found', origin: 'other', route: 'ssr', value: 1 },
			{ result: 'not_found', origin: 'unknown', route: 'header', value: 1 },
			{ result: 'not_found', origin: 'other', route: 'footer', value: 1 },
			{ result: 'not_found', origin: 'unknown', route: 'other', value: 1 },
			{ result: 'not_found', origin: 'navno-frontend', route: 'other', value: 1 },
		]);
	});

	it('ignores origin values that could be used for log injection', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(unreachableError()));

		const app = buildApp(await loadHandler());
		await requestWithVersion(app, STALE_VERSION_ID, { origin: 'evil\napp' });

		expect(proxyLogs(infoSpy)[0]).toContain('origin: unknown');
	});

	it.each([
		['not_found', notFoundError],
		['unreachable', unreachableError],
	])('logs %s at info level first, and warns once it has persisted for ten minutes', async (_, error) => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(error()));

		const app = buildApp(await loadHandler());
		await requestWithVersion(app, STALE_VERSION_ID);
		await vi.advanceTimersByTimeAsync(FIVE_MINUTES);
		await requestWithVersion(app, STALE_VERSION_ID);

		expect(proxyLogs(infoSpy)).toHaveLength(1);
		expect(proxyLogs(warnSpy)).toHaveLength(0);

		await vi.advanceTimersByTimeAsync(FIVE_MINUTES);
		await requestWithVersion(app, STALE_VERSION_ID);

		const warnings = proxyLogs(warnSpy);
		expect(warnings).toHaveLength(1);
		expect(warnings[0]).toContain('still occurring after 10 minutes on this pod');
		expect(parseMetaData(warnings[0]).persistent).toBe(true);

		await vi.advanceTimersByTimeAsync(TEN_MINUTES);
		await requestWithVersion(app, STALE_VERSION_ID);
		await vi.advanceTimersByTimeAsync(TEN_MINUTES);
		await requestWithVersion(app, STALE_VERSION_ID);

		expect(proxyLogs(warnSpy).map((log: string) => log.match(/still occurring after \d+ minutes/)?.[0])).toEqual([
			'still occurring after 10 minutes',
			'still occurring after 20 minutes',
			'still occurring after 30 minutes',
		]);
	});

	it('warns for persistent 5xx responses', async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		vi.stubGlobal(
			'fetch',
			vi.fn().mockImplementation(async () => new Response('oops', { status: 500 }))
		);

		const app = buildApp(await loadHandler());
		await requestWithVersion(app, STALE_VERSION_ID);
		await vi.advanceTimersByTimeAsync(FIVE_MINUTES);
		await requestWithVersion(app, STALE_VERSION_ID);
		await vi.advanceTimersByTimeAsync(FIVE_MINUTES);
		await requestWithVersion(app, STALE_VERSION_ID);

		expect(proxyLogs(warnSpy)).toHaveLength(1);
	});

	it.each(['unreachable', 'error_response'] as const)(
		'logs one recovery after a persistent %s warning for the same origin',
		async (result) => {
			vi.useFakeTimers({ shouldAdvanceTime: true });
			const fetchMock = vi.fn().mockImplementation(async () => {
				if (result === 'unreachable') {
					throw unreachableError();
				}
				return new Response('oops', { status: 503 });
			});
			vi.stubGlobal('fetch', fetchMock);

			const app = buildApp(await loadHandler());
			const params = { origin: 'navno-frontend' };
			await requestWithVersion(app, STALE_VERSION_ID, params);
			await vi.advanceTimersByTimeAsync(FIVE_MINUTES);
			await requestWithVersion(app, STALE_VERSION_ID, params);
			await vi.advanceTimersByTimeAsync(FIVE_MINUTES);
			await requestWithVersion(app, STALE_VERSION_ID, params);
			expect(proxyLogs(warnSpy)).toHaveLength(1);

			fetchMock.mockResolvedValue(new Response('proxied response'));
			await requestWithVersion(app, STALE_VERSION_ID, { origin: 'another-app' });
			expect(proxyLogs(infoSpy)).toHaveLength(1);

			await requestWithVersion(app, STALE_VERSION_ID, params);
			await requestWithVersion(app, STALE_VERSION_ID, params);

			const infoLogs = proxyLogs(infoSpy);
			expect(infoLogs).toHaveLength(2);
			expect(infoLogs[1]).toContain('proxying succeeded after persistent');
			expect(parseMetaData(infoLogs[1])).toEqual({
				result: 'recovered',
				previousResults: [result],
				requestedVersion: STALE_VERSION_ID,
				path: '/',
				origin: 'navno-frontend',
			});
		}
	);

	it('does not log a recovery for a version that was not found', async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		const fetchMock = vi.fn().mockRejectedValue(notFoundError());
		vi.stubGlobal('fetch', fetchMock);

		const app = buildApp(await loadHandler());
		await requestWithVersion(app, STALE_VERSION_ID);
		await vi.advanceTimersByTimeAsync(FIVE_MINUTES);
		await requestWithVersion(app, STALE_VERSION_ID);
		await vi.advanceTimersByTimeAsync(FIVE_MINUTES);
		await requestWithVersion(app, STALE_VERSION_ID);
		expect(proxyLogs(warnSpy)).toHaveLength(1);

		fetchMock.mockResolvedValue(new Response('proxied response'));
		await requestWithVersion(app, STALE_VERSION_ID);
		expect(proxyLogs(infoSpy)).toHaveLength(1);
	});

	it('restarts the warning grace period after a successful response', async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		const fetchMock = vi
			.fn()
			.mockRejectedValueOnce(unreachableError())
			.mockResolvedValueOnce(new Response('proxied response', { status: 200 }))
			.mockRejectedValue(unreachableError());
		vi.stubGlobal('fetch', fetchMock);

		const app = buildApp(await loadHandler());
		await requestWithVersion(app, STALE_VERSION_ID);
		await vi.advanceTimersByTimeAsync(FIVE_MINUTES);
		await requestWithVersion(app, STALE_VERSION_ID);
		await vi.advanceTimersByTimeAsync(FIVE_MINUTES);
		await requestWithVersion(app, STALE_VERSION_ID);

		expect(proxyLogs(warnSpy)).toHaveLength(0);
		expect(proxyLogs(infoSpy)).toHaveLength(2);

		await vi.advanceTimersByTimeAsync(FIVE_MINUTES);
		await requestWithVersion(app, STALE_VERSION_ID);
		await vi.advanceTimersByTimeAsync(FIVE_MINUTES);
		await requestWithVersion(app, STALE_VERSION_ID);

		expect(proxyLogs(warnSpy)).toHaveLength(1);
	});

	it('keeps the log rate limit when problems alternate with successful responses', async () => {
		const fetchMock = vi.fn();
		for (let i = 0; i < 3; i += 1) {
			fetchMock
				.mockRejectedValueOnce(unreachableError())
				.mockResolvedValueOnce(new Response('proxied response', { status: 200 }));
		}
		vi.stubGlobal('fetch', fetchMock);

		const app = buildApp(await loadHandler());
		for (let i = 0; i < 6; i += 1) {
			await requestWithVersion(app, STALE_VERSION_ID);
		}

		expect(proxyLogs(infoSpy)).toHaveLength(1);
		expect(await metricValues()).toEqual({ proxied: 3, unreachable: 3 });
	});

	it('does not warn when the problem stops for longer than the log interval', async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(unreachableError()));

		const app = buildApp(await loadHandler());
		await requestWithVersion(app, STALE_VERSION_ID);
		await vi.advanceTimersByTimeAsync(TEN_MINUTES + 1000);
		await requestWithVersion(app, STALE_VERSION_ID);

		expect(proxyLogs(warnSpy)).toHaveLength(0);
		expect(proxyLogs(infoSpy)).toHaveLength(2);
	});

	it('logs at most once every ten minutes per result, version and origin', async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(unreachableError()));

		const app = buildApp(await loadHandler());
		for (let i = 0; i < 3; i += 1) {
			await requestWithVersion(app, STALE_VERSION_ID, { origin: 'first-app' });
		}
		await requestWithVersion(app, STALE_VERSION_ID, { origin: 'second-app' });
		await requestWithVersion(app, '89abcdf', { origin: 'first-app' });

		expect(proxyLogs(infoSpy)).toHaveLength(3);

		await vi.advanceTimersByTimeAsync(FIVE_MINUTES);
		await requestWithVersion(app, STALE_VERSION_ID, { origin: 'first-app' });
		await vi.advanceTimersByTimeAsync(FIVE_MINUTES);
		await requestWithVersion(app, STALE_VERSION_ID, { origin: 'first-app' });

		expect(proxyLogs(infoSpy)).toHaveLength(3);
		expect(proxyLogs(warnSpy)).toHaveLength(1);
		expect(await metricValues()).toEqual({ unreachable: 7 });
	});

	it('logs separately per moduler version and entry point when origin is missing', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(unreachableError()));

		const app = buildApp(await loadHandler());
		await requestWithVersion(app, STALE_VERSION_ID, { decoratorModulerVersion: '3.0.0', pageType: 'a' });
		await requestWithVersion(app, STALE_VERSION_ID, { decoratorModulerVersion: '3.0.0', pageType: 'b' });
		await requestWithVersion(app, STALE_VERSION_ID, { decoratorModulerVersion: '4.3.0' });
		await requestWithVersion(app, STALE_VERSION_ID, {
			decoratorModulerVersion: '4.3.0',
			decoratorModulerEntryPoint: 'csr',
		});
		await requestWithVersion(app, STALE_VERSION_ID);
		await requestWithVersion(app, STALE_VERSION_ID);

		const logged = proxyLogs(infoSpy).map((log: string) => {
			const { decoratorModulerVersion, decoratorModulerEntryPoint } = parseMetaData(log);
			return [decoratorModulerVersion, decoratorModulerEntryPoint];
		});
		expect(logged).toEqual([
			['3.0.0', undefined],
			['4.3.0', undefined],
			['4.3.0', 'csr'],
			[undefined, undefined],
		]);
	});

	it('ignores moduler version and entry point in the key when origin is set', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(unreachableError()));

		const app = buildApp(await loadHandler());
		await requestWithVersion(app, STALE_VERSION_ID, { origin: 'my-app', decoratorModulerVersion: '3.0.0' });
		await requestWithVersion(app, STALE_VERSION_ID, { origin: 'my-app', decoratorModulerVersion: '4.3.0' });

		expect(proxyLogs(infoSpy)).toHaveLength(1);
	});
});
