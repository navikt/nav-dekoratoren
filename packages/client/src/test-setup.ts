import { afterAll, afterEach, expect, vi } from "vitest";
import { mockFetch } from "@itsy/corgi/testing";
import type { AppState } from "decorator-shared/types";

/**
 * jsdom emulates a 60fps display, so every `requestAnimationFrame` callback
 * costs ~17ms of real time — and `@open-wc`'s `fixture()` awaits one frame on
 * every call. Nothing in this suite depends on frame *pacing*, only on rAF
 * callbacks running after the current task, so run them on a macrotask.
 *
 * A macrotask rather than a microtask on purpose: it still queues behind
 * timers already scheduled by the code under test, which is the ordering a
 * real frame would have given us.
 *
 * The real `setTimeout` is captured here, before any test installs fake timers,
 * so a fixture awaited under `vi.useFakeTimers()` still resolves promptly
 * instead of waiting for the fake clock to be advanced. `fakeTimers.toFake` in
 * vitest.config.ts keeps rAF itself out of the faking, so this stays installed.
 */
const realSetTimeout = globalThis.setTimeout;
const realClearTimeout = globalThis.clearTimeout;
globalThis.requestAnimationFrame = (callback: FrameRequestCallback) =>
    realSetTimeout(() => callback(performance.now()), 0) as unknown as number;
globalThis.cancelAnimationFrame = (handle: number) =>
    realClearTimeout(handle as unknown as ReturnType<typeof setTimeout>);

/**
 * `vi.waitFor` checks once synchronously, then polls on a 50ms interval. Almost
 * everything here settles a few microtask hops after the act phase — too late
 * for that first check, so the default interval is ~50ms of pure latency per
 * call. These are in-memory fakes, so poll as fast as the timer queue allows.
 */
export const waitFor: typeof vi.waitFor = (callback, options = {}) =>
    vi.waitFor(callback, {
        interval: 1,
        ...(typeof options === "number" ? { timeout: options } : options),
    });

/**
 * Shared fake transport for the whole suite, installed as the global fetch.
 * `decoratorApi` is created at module scope with no explicit `fetch`, and
 * corgi's default base fetcher dereferences `globalThis.fetch` on every call —
 * so the already-constructed client (and everything `.extend`ed from it) hits
 * this mock with no `vi.mock` involved. Tests register routes on `http` and
 * assert on `http.calls`/`http.lastCall`; the real pipeline (decoratorParams,
 * withDecoratorMeta, retry, abortPrevious, HttpError) runs in every test.
 *
 * `reset()` clears routes AND the call log, so shared baseline routes belong in
 * a `beforeEach`, never at module scope.
 */
export const http = mockFetch();
const restoreFetch = http.install();

afterEach(() => {
    try {
        // Every request must hit a registered route. An unmatched call rejects
        // with MockRouteError, but this codebase catches-and-logs fetch errors
        // everywhere — this is what turns a typo'd route into a loud failure.
        expect(
            http.unmatchedCalls.map((call) => `${call.method} ${call.url}`),
        ).toEqual([]);
    } finally {
        http.reset();
    }
});

afterAll(() => {
    restoreFetch();
});

export const setDecoratorData = (overrides: Partial<AppState> = {}) => {
    window.__DECORATOR_DATA__ = {
        params: {},
        texts: {},
        ...overrides,
        // The withDecoratorMeta plugin runs for real now, and it resolves urls
        // via `new URL(url, env("APP_URL"))` — an undefined base throws on the
        // relative urls every callsite uses. Matches the jsdom url.
        env: {
            APP_URL: "http://localhost",
            VERSION_ID: "test-version-id",
            ...overrides.env,
        },
    } as AppState;
};
