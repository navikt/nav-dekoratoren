import { afterEach, describe, expect, test, vi } from "vitest";
import { isValidNavUrl } from "decorator-shared/urls";

/**
 * `isValidNavUrl` ships in the client bundle: `views/header.ts` and
 * `views/footer.ts` import `paramsSchema` as a value, and the breadcrumbs
 * template calls it directly. Its localhost gate therefore has to behave
 * correctly in a browser, where `process` does not exist.
 *
 * The gate keys off the decorator's own `APP_URL`, which the browser reads from
 * the `__DECORATOR_DATA__` payload the server inlines into the page. The suite
 * in `decorator-shared` runs under the `node` environment and covers the
 * `process.env` branch; these tests cover the browser branch.
 */

const setDecoratorAppUrl = (appUrl: string) =>
    vi.stubGlobal("__DECORATOR_DATA__", { env: { APP_URL: appUrl } });

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("isValidNavUrl with the decorator served from localhost", () => {
    test("allows localhost targets", () => {
        setDecoratorAppUrl("http://localhost:8089");

        expect(isValidNavUrl("http://localhost")).toBe(true);
        expect(isValidNavUrl("http://localhost:3000/foo")).toBe(true);
    });

    test("still allows nav urls and relative paths", () => {
        setDecoratorAppUrl("http://localhost:8089");

        expect(isValidNavUrl("https://www.nav.no")).toBe(true);
        expect(isValidNavUrl("/foo")).toBe(true);
    });

    test("does not weaken the other checks", () => {
        setDecoratorAppUrl("http://localhost:8089");

        expect(isValidNavUrl("http://localhost@evil.com")).toBe(false);
        expect(isValidNavUrl("http://localhost:8080@evil.com/x")).toBe(false);
        expect(isValidNavUrl("http://localhost.evil.com")).toBe(false);
        expect(isValidNavUrl("//evil.com")).toBe(false);
    });
});

describe("isValidNavUrl with the decorator deployed to dev", () => {
    test("allows localhost targets, so apps run locally against dev", () => {
        setDecoratorAppUrl("https://dekoratoren.ekstern.dev.nav.no");

        expect(isValidNavUrl("http://localhost")).toBe(true);
        expect(isValidNavUrl("http://localhost:3000/foo")).toBe(true);
    });

    test("also covers the internal dev ingresses", () => {
        setDecoratorAppUrl("https://dekoratoren-beta.intern.dev.nav.no");

        expect(isValidNavUrl("http://localhost:3000/foo")).toBe(true);
    });
});

describe("isValidNavUrl with the decorator deployed to production", () => {
    /**
     * Regression guard. The gate used to read `location.hostname`, but the
     * client bundle runs on the *consuming* application's page, so `location`
     * describes the consumer rather than the decorator. An app served from
     * localhost against the production decorator therefore had every localhost
     * target accepted.
     *
     * `vitest.config.ts` pins the jsdom url to `http://localhost`, so the page
     * origin is localhost here while APP_URL is production. That is exactly the
     * combination the old gate got wrong.
     */
    test("rejects localhost targets even on a localhost page", () => {
        setDecoratorAppUrl("https://www.nav.no/dekoratoren");

        expect(window.location.hostname).toBe("localhost");

        expect(isValidNavUrl("http://localhost")).toBe(false);
        expect(isValidNavUrl("http://localhost:3000/foo")).toBe(false);
        expect(isValidNavUrl("https://localhost:3000/foo")).toBe(false);
    });

    test("still allows nav urls and relative paths", () => {
        setDecoratorAppUrl("https://www.nav.no/dekoratoren");

        expect(isValidNavUrl("https://www.nav.no")).toBe(true);
        expect(isValidNavUrl("https://anyteam.nais.io/")).toBe(true);
        expect(isValidNavUrl("/foo")).toBe(true);
    });
});

describe("isValidNavUrl without decorator data", () => {
    // Fail closed: an unreadable APP_URL is treated as production, so the
    // failure mode is a rejected redirect rather than an open one. The
    // `process.env` fallback is pinned empty so the assertion does not depend on
    // whatever APP_URL happens to be in the shell running the suite.
    const withoutAppUrl = () => {
        vi.stubGlobal("__DECORATOR_DATA__", undefined);
        vi.stubEnv("APP_URL", "");
    };

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    test("rejects localhost targets", () => {
        withoutAppUrl();

        expect(isValidNavUrl("http://localhost:3000/foo")).toBe(false);
    });

    test("still allows nav urls and relative paths", () => {
        withoutAppUrl();

        expect(isValidNavUrl("https://www.nav.no")).toBe(true);
        expect(isValidNavUrl("/foo")).toBe(true);
    });
});
