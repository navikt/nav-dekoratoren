import { afterAll, afterEach, expect } from "vitest";
import { mockFetch } from "@itsy/corgi/testing";
import type { AppState } from "decorator-shared/types";

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
