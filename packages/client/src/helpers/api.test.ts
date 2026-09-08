import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { decoratorApi, decoratorParams } from "./api";
import { apiPath, http, setDecoratorData, TEST_APP_URL } from "../test-setup";

/**
 * `APP_URL` carries a path prefix in production (`https://www.nav.no/dekoratoren`)
 * and the ingresses do not strip it, so every decorator route lives under that
 * prefix. Resolving a root-relative path against it - `new URL("/main-menu",
 * "https://www.nav.no/dekoratoren")` - silently drops the prefix and produces
 * `https://www.nav.no/main-menu`, which is Enonic, not the decorator.
 */

/**
 * `decoratorApi` captures `baseURL` when the module is evaluated, so a different
 * `APP_URL` needs a fresh module registry. This re-evaluates `./api` against the
 * given value and hands back that build of the client.
 */
const importApiWithAppUrl = async (appUrl: string) => {
    setDecoratorData({
        env: { APP_URL: appUrl, VERSION_ID: "test-version-id" },
    } as never);
    vi.resetModules();
    return (await import("./api")).decoratorApi;
};

describe("decoratorApi", () => {
    beforeEach(() => {
        setDecoratorData();
        http.any({ status: 204 });
    });

    afterEach(() => {
        vi.resetModules();
    });

    it("keeps the path prefix from APP_URL", async () => {
        await decoratorApi("/main-menu");

        expect(http.lastCall?.pathname).toBe(apiPath("/main-menu"));
        expect(http.lastCall?.url).toContain(`${TEST_APP_URL}/main-menu?`);
    });

    it("keeps the prefix on a nested route", async () => {
        await decoratorApi("/api/notifications/123/archive", {
            method: "POST",
        });

        expect(http.lastCall?.pathname).toBe(
            apiPath("/api/notifications/123/archive"),
        );
    });

    it("stamps version-id and consumer onto every request", async () => {
        await decoratorApi("/main-menu");

        expect(http.lastCall?.query.get("version-id")).toBe("test-version-id");
        expect(http.lastCall?.query.get("consumer")).toBe("dekoratoren");
    });

    it("keeps the metadata alongside a query the callsite already built", async () => {
        await decoratorApi("/main-menu", {
            query: decoratorParams({ context: "privatperson" }),
        });

        expect(http.lastCall?.pathname).toBe(apiPath("/main-menu"));
        expect(http.lastCall?.query.get("context")).toBe("privatperson");
        expect(http.lastCall?.query.get("version-id")).toBe("test-version-id");
        expect(http.lastCall?.query.get("consumer")).toBe("dekoratoren");
    });

    it("leaves an absolute url untouched by the base", async () => {
        await decoratorApi("http://localhost:1234/oauth2/session");

        expect(http.lastCall?.pathname).toBe("/oauth2/session");
        expect(http.lastCall?.url).toContain("http://localhost:1234/");
        expect(http.lastCall?.url).not.toContain("/dekoratoren");
    });

    it("passes the base through to extended clients", async () => {
        await decoratorApi.extend({ retry: 0 })("/auth");

        expect(http.lastCall?.pathname).toBe(apiPath("/auth"));
    });
});

describe("decoratorApi across APP_URL shapes", () => {
    beforeEach(() => {
        http.any({ status: 204 });
    });

    afterEach(() => {
        vi.resetModules();
        setDecoratorData();
    });

    const appUrlShapes: Array<[shape: string, appUrl: string, path: string]> = [
        [
            "a single-segment prefix (prod: /dekoratoren)",
            "http://localhost/dekoratoren",
            "/dekoratoren/main-menu",
        ],
        [
            "a multi-segment prefix (prod: /common-html/v4/navno)",
            "http://localhost/common-html/v4/navno",
            "/common-html/v4/navno/main-menu",
        ],
        ["an origin-only APP_URL (dev)", "http://localhost", "/main-menu"],
        [
            "a trailing-slash APP_URL, without doubling the slash",
            "http://localhost/dekoratoren/",
            "/dekoratoren/main-menu",
        ],
    ];

    it.each(appUrlShapes)(
        "resolves the route under %s",
        async (_shape, appUrl, path) => {
            const api = await importApiWithAppUrl(appUrl);

            await api("/main-menu");

            expect(http.lastCall?.pathname).toBe(path);
        },
    );

    /**
     * The exact shape of the outage, pinned as a value: the client must not
     * resolve the route against the base the way `new URL` would.
     */
    it("does not resolve root-relative paths the way new URL does", async () => {
        const appUrl = "https://www.nav.no/dekoratoren";
        const api = await importApiWithAppUrl(appUrl);

        await api("/main-menu");

        expect(new URL("/main-menu", appUrl).pathname).toBe("/main-menu");
        expect(http.lastCall?.pathname).toBe("/dekoratoren/main-menu");
        expect(http.lastCall?.url).toContain(
            "https://www.nav.no/dekoratoren/main-menu?",
        );
    });
});

describe("decoratorParams", () => {
    it("merges current params with overrides and json-stringifies arrays", () => {
        setDecoratorData({
            params: { context: "privatperson", breadcrumbs: [{ url: "/a" }] },
        } as never);

        expect(decoratorParams({ context: "arbeidsgiver" })).toEqual({
            context: "arbeidsgiver",
            breadcrumbs: '[{"url":"/a"}]',
        });
    });
});
