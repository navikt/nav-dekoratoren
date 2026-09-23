import { Hono } from 'hono';
import { VERSION_ID_PARAM } from 'decorator-shared/constants';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { env } from '../env/server';
import type { versionProxyHandler as VersionProxyHandler } from './version-proxy';

// A valid-looking (but not necessarily real) short commit hash, matching the
// format versionProxyHandler requires before it will attempt to proxy.
const STALE_VERSION_ID = '1234567';

// The handler tracks stale-version failure state in a module-level map, so
// each test gets a fresh module instance to avoid leaking counts/timers
// between tests.
const loadHandler = async (): Promise<typeof VersionProxyHandler> => {
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

const requestWithVersion = (app: Hono, versionId: string) => app.request(`/?${VERSION_ID_PARAM}=${versionId}`);

describe('versionProxyHandler', () => {
	let errorSpy: ReturnType<typeof vi.spyOn>;
	let warnSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
		vi.useRealTimers();
	});

	const errorMessages = () => errorSpy.mock.calls.map((call: unknown[]) => String(call[0]));
	const warnMessages = () => warnSpy.mock.calls.map((call: unknown[]) => String(call[0]));
	const staleVersionLogs = (messages: string[]) =>
		messages.filter((message) => message.includes("Falling back to this pod's own"));

	it('does not log a fallback when the proxied pod responds', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('proxied response', { status: 200 })));

		const app = buildApp(await loadHandler());
		const res = await requestWithVersion(app, STALE_VERSION_ID);

		expect(await res.text()).toBe('proxied response');
		expect(staleVersionLogs(errorMessages())).toHaveLength(0);
		expect(staleVersionLogs(warnMessages())).toHaveLength(0);
	});

	it('does not warn on the first failures for a stale version', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('getaddrinfo ENOTFOUND stale-pod')));

		const app = buildApp(await loadHandler());

		await requestWithVersion(app, STALE_VERSION_ID);
		await requestWithVersion(app, STALE_VERSION_ID);

		expect(staleVersionLogs(warnMessages())).toHaveLength(0);
		expect(staleVersionLogs(errorMessages())).toHaveLength(0);
	});

	it('does not warn during the initial delay', async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('getaddrinfo ENOTFOUND stale-pod')));

		const app = buildApp(await loadHandler());

		for (let i = 0; i < 6; i += 1) {
			await requestWithVersion(app, STALE_VERSION_ID);
		}

		expect(staleVersionLogs(warnMessages())).toHaveLength(0);
		expect(staleVersionLogs(errorMessages())).toHaveLength(0);
	});

	it('warns once failures have persisted for ten minutes', async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('getaddrinfo ENOTFOUND stale-pod')));

		const app = buildApp(await loadHandler());

		await requestWithVersion(app, STALE_VERSION_ID);
		await vi.advanceTimersByTimeAsync(10 * 60 * 1000);
		await requestWithVersion(app, STALE_VERSION_ID);

		const warnings = staleVersionLogs(warnMessages());
		expect(warnings).toHaveLength(1);
		expect(warnings[0]).toContain(STALE_VERSION_ID);
		expect(warnings[0]).toContain(env.VERSION_ID);
		expect(warnings[0]).toContain('2 consecutive failed proxy attempts');
		expect(warnings[0]).toContain('first failure at');
		expect(staleVersionLogs(errorMessages())).toHaveLength(0);
	});

	it('logs at most one warning every ten minutes for a still-failing version', async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('getaddrinfo ENOTFOUND stale-pod')));

		const app = buildApp(await loadHandler());

		await requestWithVersion(app, STALE_VERSION_ID);
		await vi.advanceTimersByTimeAsync(10 * 60 * 1000);
		await requestWithVersion(app, STALE_VERSION_ID);

		// Keep failing within the warning interval.
		for (let i = 0; i < 4; i += 1) {
			await requestWithVersion(app, STALE_VERSION_ID);
		}

		expect(staleVersionLogs(warnMessages())).toHaveLength(1);

		// Advance past the warning interval - the next failure should log again.
		await vi.advanceTimersByTimeAsync(10 * 60 * 1000);
		await requestWithVersion(app, STALE_VERSION_ID);

		expect(staleVersionLogs(warnMessages())).toHaveLength(2);
		expect(staleVersionLogs(errorMessages())).toHaveLength(0);
	});

	it('tracks each version independently', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('getaddrinfo ENOTFOUND stale-pod')));

		const app = buildApp(await loadHandler());
		const otherVersionId = '89abcdf';

		await requestWithVersion(app, STALE_VERSION_ID);
		await requestWithVersion(app, STALE_VERSION_ID);
		await requestWithVersion(app, otherVersionId);

		// Neither version has reached the warning delay yet.
		expect(staleVersionLogs(errorMessages())).toHaveLength(0);
		expect(staleVersionLogs(warnMessages())).toHaveLength(0);
	});

	it('resets the failure count once the version starts responding again', async () => {
		const fetchMock = vi
			.fn()
			.mockRejectedValueOnce(new Error('getaddrinfo ENOTFOUND stale-pod'))
			.mockRejectedValueOnce(new Error('getaddrinfo ENOTFOUND stale-pod'))
			.mockResolvedValueOnce(new Response('proxied response', { status: 200 }))
			.mockRejectedValue(new Error('getaddrinfo ENOTFOUND stale-pod'));
		vi.stubGlobal('fetch', fetchMock);

		const app = buildApp(await loadHandler());

		await requestWithVersion(app, STALE_VERSION_ID);
		await requestWithVersion(app, STALE_VERSION_ID);
		await requestWithVersion(app, STALE_VERSION_ID); // succeeds, resets the streak
		await requestWithVersion(app, STALE_VERSION_ID);
		await requestWithVersion(app, STALE_VERSION_ID);

		// Neither failure streak persists long enough to trigger a warning.
		expect(staleVersionLogs(errorMessages())).toHaveLength(0);
		expect(staleVersionLogs(warnMessages())).toHaveLength(0);
	});
});
