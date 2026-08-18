import { afterEach, describe, expect, test, vi } from "vitest";
import { isValidNavUrl } from "decorator-shared/urls";

/**
 * `isValidNavUrl` ships in the client bundle: `views/header.ts` and
 * `views/footer.ts` import `paramsSchema` as a value, and the breadcrumbs
 * template calls it directly. Its localhost gate therefore has to behave
 * correctly in a browser, where `process` does not exist.
 *
 * The suite in `decorator-shared` runs under the `node` environment and only
 * covers the NODE_ENV branch. These tests cover the browser branch, which keys
 * off the page's own origin.
 */

const setPageOrigin = (href: string) =>
    vi.stubGlobal("location", new URL(href));

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("isValidNavUrl on a localhost page", () => {
    test("allows localhost targets", () => {
        setPageOrigin("http://localhost:3000/foo");

        expect(isValidNavUrl("http://localhost")).toBe(true);
        expect(isValidNavUrl("http://localhost:3000/foo")).toBe(true);
    });

    test("still allows nav urls and relative paths", () => {
        setPageOrigin("http://localhost:3000/foo");

        expect(isValidNavUrl("https://www.nav.no")).toBe(true);
        expect(isValidNavUrl("/foo")).toBe(true);
    });

    test("does not weaken the other checks", () => {
        setPageOrigin("http://localhost:3000/foo");

        expect(isValidNavUrl("http://localhost@evil.com")).toBe(false);
        expect(isValidNavUrl("http://localhost:8080@evil.com/x")).toBe(false);
        expect(isValidNavUrl("http://localhost.evil.com")).toBe(false);
        expect(isValidNavUrl("//evil.com")).toBe(false);
    });
});

describe("isValidNavUrl on a production page", () => {
    /**
     * Regression guard. The gate used to read
     * `typeof process === "undefined" || process.env?.NODE_ENV !== "production"`,
     * whose first term short-circuits to `true` in the browser because
     * `process` is not defined there. Every localhost target was accepted
     * client-side, including in production, while the server rejected them.
     */
    test("rejects localhost targets", () => {
        setPageOrigin("https://www.nav.no/foo");

        expect(isValidNavUrl("http://localhost")).toBe(false);
        expect(isValidNavUrl("http://localhost:3000/foo")).toBe(false);
        expect(isValidNavUrl("https://localhost:3000/foo")).toBe(false);
    });

    test("still allows nav urls and relative paths", () => {
        setPageOrigin("https://www.nav.no/foo");

        expect(isValidNavUrl("https://www.nav.no")).toBe(true);
        expect(isValidNavUrl("https://anyteam.nais.io/")).toBe(true);
        expect(isValidNavUrl("/foo")).toBe(true);
    });
});
