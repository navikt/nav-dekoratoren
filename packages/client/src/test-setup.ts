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

/**
 * `APP_URL` is not origin-only in production, exercise that mechanism in tests
 */
export const TEST_APP_PATH = "/dekoratoren";
export const TEST_APP_URL = `http://localhost${TEST_APP_PATH}`;

/** The pathname a decorator route is actually requested on. */
export const apiPath = (path: string) => `${TEST_APP_PATH}${path}`;

export const setDecoratorData = (overrides: Partial<AppState> = {}) => {
    window.__DECORATOR_DATA__ = {
        params: {},
        texts: {},
        ...overrides,
        env: {
            APP_URL: TEST_APP_URL,
            VERSION_ID: "test-version-id",
            ...overrides.env,
        },
    } as AppState;
};

/**
 * Seeded at module scope, not just per-test: `helpers/api.ts` reads
 * `env("APP_URL")` eagerly when corgi builds `decoratorApi`, so
 * `window.__DECORATOR_DATA__` has to exist before any test file imports it.
 * Setup files are evaluated before the test module graph, so this is the only
 * place that can win the race.
 *
 * Per-test `setDecoratorData()` calls still reset
 * params/texts, but the client's `baseURL` is already fixed at `TEST_APP_URL` -
 * a test that needs a different one has to build its own corgi client.
 */
setDecoratorData();
