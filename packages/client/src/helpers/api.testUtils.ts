import { vi, type Mock } from "vitest";
import type { AppState } from "decorator-shared/types";

/**
 * Test-only helpers. Not imported by production code.
 *
 * `decoratorApi` is a callable corgi instance that also exposes `.get`/`.post`/
 * `.extend`. Callsites use all of these shapes, so the mock has to as well.
 * `.extend` returns the same mock, meaning extended instances
 * (`extend({ retry: 0 })`, `extend({ abortPrevious: true })`) are captured by
 * the same set of spies.
 */
export type DecoratorApiMock = Mock & {
    get: Mock;
    post: Mock;
    extend: Mock;
};

const createDecoratorApiMock = (): DecoratorApiMock => {
    const api = vi.fn() as DecoratorApiMock;
    api.get = vi.fn();
    api.post = vi.fn();
    api.extend = vi.fn(() => api);
    return api;
};

/**
 * Singleton so `vi.mock` factories (which are hoisted above imports) can
 * reference it without a dynamic import dance. `vi.clearAllMocks()` in an
 * `afterEach` resets call history between tests.
 */
export const decoratorApiMock = createDecoratorApiMock();

export const decoratorParamsMock = vi.fn(() => ({ mocked: true }));

/**
 * `vi.mock` factories are hoisted above imports, so the factory cannot close
 * over a statically imported binding. Each test file inlines:
 *
 *     vi.mock("../helpers/api", async () => {
 *         const mock = await import("../helpers/api.testUtils");
 *         return {
 *             decoratorApi: mock.decoratorApiMock,
 *             decoratorParams: mock.decoratorParamsMock,
 *         };
 *     });
 */

/**
 * `.extend` is re-mocked because `clearAllMocks` wipes its implementation,
 * which would otherwise make extended instances `undefined` in later tests.
 */
export const resetDecoratorApiMock = () => {
    decoratorApiMock.extend.mockImplementation(() => decoratorApiMock);
    decoratorParamsMock.mockImplementation(() => ({ mocked: true }));
};

export const setDecoratorData = (overrides: Partial<AppState> = {}) => {
    window.__DECORATOR_DATA__ = {
        params: {},
        env: {},
        texts: {},
        ...overrides,
    } as AppState;
};
