import { beforeEach, describe, expect, it } from "vitest";
import { decoratorApi, decoratorParams } from "./api";
import { http, setDecoratorData } from "../test-setup";

/**
 * The url join is the whole point of this file.
 *
 * `APP_URL` carries a path prefix in production (`https://www.nav.no/dekoratoren`)
 * and the ingresses do not strip it, so every decorator route lives under that
 * prefix. Resolving a root-relative path against it - `new URL("/main-menu",
 * "https://www.nav.no/dekoratoren")` - silently drops the prefix and produces
 * `https://www.nav.no/main-menu`, which is Enonic, not the decorator. That
 * shipped, and broke every client fetch in prod.
 */
const setAppUrl = (appUrl: string) =>
    setDecoratorData({
        env: { APP_URL: appUrl, VERSION_ID: "test-version-id" },
    } as never);

describe("decoratorApi url resolution", () => {
    beforeEach(() => {
        http.any({ status: 204 });
    });

    it("keeps the path prefix in APP_URL", async () => {
        setAppUrl("http://localhost/dekoratoren");

        await decoratorApi("/main-menu");

        expect(http.lastCall?.pathname).toBe("/dekoratoren/main-menu");
    });

    it("handles a multi-segment path prefix", async () => {
        setAppUrl("http://localhost/common-html/v4/navno");

        await decoratorApi("/api/notifications/123/archive");

        expect(http.lastCall?.pathname).toBe(
            "/common-html/v4/navno/api/notifications/123/archive",
        );
    });

    it("works with an origin-only APP_URL", async () => {
        setAppUrl("http://localhost");

        await decoratorApi("/main-menu");

        expect(http.lastCall?.pathname).toBe("/main-menu");
    });

    it("does not double up slashes on a trailing-slash APP_URL", async () => {
        setAppUrl("http://localhost/dekoratoren/");

        await decoratorApi("/main-menu");

        expect(http.lastCall?.pathname).toBe("/dekoratoren/main-menu");
    });

    it("leaves an absolute url untouched", async () => {
        setAppUrl("http://localhost/dekoratoren");

        await decoratorApi("http://localhost:1234/oauth2/session");

        expect(http.lastCall?.url).toContain("http://localhost:1234/");
        expect(http.lastCall?.pathname).toBe("/oauth2/session");
    });
});

describe("withDecoratorMeta request metadata", () => {
    beforeEach(() => {
        http.any({ status: 204 });
        setAppUrl("http://localhost/dekoratoren");
    });

    it("stamps version-id and consumer onto every request", async () => {
        await decoratorApi("/main-menu");

        expect(http.lastCall?.query.get("version-id")).toBe("test-version-id");
        expect(http.lastCall?.query.get("consumer")).toBe("dekoratoren");
    });

    it("keeps the metadata when the callsite already has a query string", async () => {
        await decoratorApi("/main-menu?context=privatperson");

        expect(http.lastCall?.query.get("context")).toBe("privatperson");
        expect(http.lastCall?.query.get("version-id")).toBe("test-version-id");
        expect(http.lastCall?.pathname).toBe("/dekoratoren/main-menu");
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
