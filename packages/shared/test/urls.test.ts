import { describe, expect, it } from "bun:test";
import { makeFrontpageUrl, makeLoginUrl } from "lib/urls";

const dummyEnv = {
    LOGIN_URL: "https://www.nav.no/login",
    APP_URL: "https://www.nav.no",
    MIN_SIDE_URL: "https://www.nav.no/min-side",
    MIN_SIDE_ARBEIDSGIVER_URL: "https://www.nav.no/min-side-arbeidsgiver",
};

describe("Login URLs", () => {
    it("Basic login URL with redirect is created correctly", () => {
        const loginUrl = makeLoginUrl({
            environment: dummyEnv,
            params: {
                level: "Level3",
                redirectToApp: false,
                redirectToUrl: "https://www.nav.no",
                context: "privatperson",
                language: "nb",
            },
        });

        expect(loginUrl).toBe(
            "https://www.nav.no/login?redirect=https://www.nav.no&level=Level3&locale=nb",
        );
    });

    it("Redirect should be min side arbeidsgiver if context is arbeidsgiver", () => {
        const loginUrl = makeLoginUrl({
            environment: dummyEnv,
            params: {
                level: "Level3",
                redirectToApp: false,
                redirectToUrl: "",
                context: "arbeidsgiver",
                language: "nb",
            },
        });

        expect(loginUrl).toBe(
            `https://www.nav.no/login?redirect=${dummyEnv.MIN_SIDE_ARBEIDSGIVER_URL}&level=Level3&locale=nb`,
        );
    });

    it("Redirect should be min side if no redirectToUrl is set and redirectToApp is false and context is anything but arbeidsgiver", () => {
        const loginUrl = makeLoginUrl({
            environment: dummyEnv,
            params: {
                level: "Level3",
                redirectToApp: false,
                redirectToUrl: "",
                context: "privatperson",
                language: "nb",
            },
        });

        expect(loginUrl).toBe(
            `https://www.nav.no/login?redirect=${dummyEnv.MIN_SIDE_URL}&level=Level3&locale=nb`,
        );
    });
});

describe("Frontpage URLs", () => {
    const baseUrl = "https://www.nav.no";

    it("Should redirect to /en/home if the language is en", () => {
        const url = makeFrontpageUrl({
            language: "en",
            context: "privatperson",
            baseUrl,
        });

        expect(url).toBe("https://www.nav.no/en/home");
    });

    it("Should redirect to / for privatperson context", () => {
        const url = makeFrontpageUrl({
            language: "nb",
            context: "privatperson",
            baseUrl,
        });

        expect(url).toBe("https://www.nav.no/");
    });

    it("Should redirect to /no/bedrift for arbeidsgiver context", () => {
        const url = makeFrontpageUrl({
            language: "nb",
            context: "arbeidsgiver",
            baseUrl,
        });

        expect(url).toBe("https://www.nav.no/no/bedrift");
    });

    it("Should redirect to /no/samarbeidspartner for arbeidsgiver context", () => {
        const url = makeFrontpageUrl({
            language: "nb",
            context: "samarbeidspartner",
            baseUrl,
        });

        expect(url).toBe("https://www.nav.no/no/samarbeidspartner");
    });
});
