import { describe, expect, test, vi } from "vitest";
import { isValidNavUrl, makeFrontpageUrl } from "../urls";

test("Frontpage URLs", () => {
    const baseUrl = "https://www.nav.no";
    expect(
        makeFrontpageUrl({ language: "en", context: "privatperson", baseUrl }),
    ).toBe("https://www.nav.no/en/home");
    expect(
        makeFrontpageUrl({ language: "nb", context: "privatperson", baseUrl }),
    ).toBe("https://www.nav.no/");
    expect(
        makeFrontpageUrl({ language: "nb", context: "arbeidsgiver", baseUrl }),
    ).toBe("https://www.nav.no/arbeidsgiver");
    expect(
        makeFrontpageUrl({
            language: "nb",
            context: "samarbeidspartner",
            baseUrl,
        }),
    ).toBe("https://www.nav.no/samarbeidspartner");
});

describe("isValidNavUrl", () => {
    test.each([
        "/foo",
        "/foo/bar?baz=qux#frag",
        "https://nav.no",
        "https://www.nav.no",
        "https://www.nav.no/qwer",
        "https://myapp.nav.no/foo",
        "https://my.app.nav.no/bar",
        "https://nais.io",
        "https://anyteam.nais.io/",
        "http://localhost",
        "http://localhost:3000/foo",
    ])("accepts %j", (url) => {
        expect(isValidNavUrl(url)).toBe(true);
    });

    // Regression test: these passed the old regex-based system
    test.each([
        "//evil.com",
        "//evil.com/path",
        "/\\evil.com",
        "/\t/evil.com",
        "http://localhost.evil.com",
        "https://localhost.evil.com/steal",
        "http://localhost@evil.com",
        "http://localhost:8080@evil.com/x",
        "https://localhost-evil.com",
        "http://localhostevil.com",
    ])("rejects open-redirect bypass %j", (url) => {
        expect(isValidNavUrl(url)).toBe(false);
    });

    test.each([
        "https://nav.no.evil.com",
        "https://nav.no@evil.com",
        "https://evil.com/?x=https://nav.no",
        "https://www.vg.no",
        "https://navv.no",
        "https://wwwnav.no/foobar",
        "https://www.navno/asdf",
        "www.nav.no",
        "http://nav.no",
        "javascript:alert(1)",
        "",
    ])("rejects %j", (url) => {
        expect(isValidNavUrl(url)).toBe(false);
    });

    test("strips tab/newline characters before validating", () => {
        expect(isValidNavUrl("https://nav.no\n@evil.com")).toBe(false);
        expect(isValidNavUrl("/\r/evil.com")).toBe(false);
        expect(isValidNavUrl("https://www.n\tav.no")).toBe(true);
    });

    test("rejects localhost in production", () => {
        vi.stubEnv("NODE_ENV", "production");
        expect(isValidNavUrl("http://localhost:3000")).toBe(false);
        expect(isValidNavUrl("https://www.nav.no")).toBe(true);
        expect(isValidNavUrl("/foo")).toBe(true);
        vi.unstubAllEnvs();
    });
});
