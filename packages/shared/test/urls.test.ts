import { describe, expect, it } from "bun:test";
import { Environment, Params } from "lib/params";
import {
    erNavDekoratoren,
    getIdPortenLocale,
    makeFrontpageUrl,
} from "lib/urls";

type GetUrlLoginOptions = {
    environment: Pick<
        Environment,
        "APP_URL" | "MIN_SIDE_URL" | "MIN_SIDE_ARBEIDSGIVER_URL" | "LOGIN_URL"
    >;
    params: Pick<
        Params,
        "redirectToApp" | "redirectToUrl" | "context" | "level" | "language"
    >;
    isClientSide?: boolean;
};

function makeRedirectUrlLogin({
    environment,
    params,
    isClientSide = false,
}: GetUrlLoginOptions) {
    const { redirectToUrl, redirectToApp } = params;

    const appUrl = environment.APP_URL;

    if (isClientSide && erNavDekoratoren(appUrl)) {
        return appUrl;
    }

    if (redirectToUrl) {
        return redirectToUrl;
    }

    if (redirectToApp) {
        return appUrl;
    }

    if (params.context === "arbeidsgiver") {
        return environment.MIN_SIDE_ARBEIDSGIVER_URL;
    }

    return environment.MIN_SIDE_URL;
}

export function makeLoginUrl(
    options: GetUrlLoginOptions & {
        overrideLevel?: string;
    },
) {
    const redirectUrl = makeRedirectUrlLogin(options);
    const idPortenLocale = getIdPortenLocale(options.params.language);

    console.log("idPortenLocale", idPortenLocale);

    const { environment, params } = options;
    return `${environment.LOGIN_URL}?redirect=${redirectUrl}&level=${options.overrideLevel || params.level}&locale=${idPortenLocale}`;
}

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
