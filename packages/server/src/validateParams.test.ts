import { describe, expect, it } from "bun:test";
import {
    parseBooleanParam,
    validateParams,
    parseAndValidateParams,
} from "./validateParams";
import { formatParams } from "decorator-shared/json";
import { Params } from "decorator-shared/params";

describe("Validating urls", () => {
    it("Should validate nav.no urls", () => {
        const params = parseAndValidateParams({
            redirectToUrl: "https://myapp.nav.no/foo",
            redirectToUrlLogout: "https://my.app.nav.no/bar",
            logoutUrl: "https://www.nav.no/qwer",
            breadcrumbs: JSON.stringify([
                {
                    handleInApp: false,
                    title: "test",
                    url: "https://www.nav.no/foobar",
                },
            ]),
            availableLanguages: JSON.stringify([
                {
                    handleInApp: false,
                    url: "https://www.nav.no/asdf",
                    locale: "nb",
                },
            ]),
        } satisfies Partial<Record<keyof Params, unknown>>);

        const {
            redirectToUrl,
            redirectToUrlLogout,
            logoutUrl,
            breadcrumbs,
            availableLanguages,
        } = params;

        expect([
            redirectToUrl,
            redirectToUrlLogout,
            logoutUrl,
            breadcrumbs[0].url,
            availableLanguages[0].url,
        ]).not.toContain(undefined);
    });

    it("Should validate paths", () => {
        const params = parseAndValidateParams({
            redirectToUrl: "/foo",
            redirectToUrlLogout: "/bar",
            logoutUrl: "/qwer",
            breadcrumbs: JSON.stringify([
                {
                    handleInApp: false,
                    title: "test",
                    url: "/foobar",
                },
            ]),
            availableLanguages: JSON.stringify([
                {
                    handleInApp: false,
                    url: "/asdf",
                    locale: "nb",
                },
            ]),
        } satisfies Partial<Record<keyof Params, unknown>>);

        const {
            redirectToUrl,
            redirectToUrlLogout,
            logoutUrl,
            breadcrumbs,
            availableLanguages,
        } = params;

        expect([
            redirectToUrl,
            redirectToUrlLogout,
            logoutUrl,
            breadcrumbs[0].url,
            availableLanguages[0].url,
        ]).not.toContain(undefined);
    });

    it("Should not validate redirectToUrl with non-nav origin", () => {
        const params = parseAndValidateParams({
            redirectToUrl: "https://www.vg.no",
        } satisfies Partial<Record<keyof Params, unknown>>);

        expect(params.redirectToUrl).toBeUndefined();
    });

    it("Should not validate redirectToUrlLogout with non-nav origins", () => {
        const params = parseAndValidateParams({
            redirectToUrlLogout: "https://navv.no",
        } satisfies Partial<Record<keyof Params, unknown>>);

        expect(params.redirectToUrlLogout).toBeUndefined();
    });

    it("Should not validate logoutUrl with non-nav origins", () => {
        const params = parseAndValidateParams({
            logoutUrl: "https://www.notevilatall.no",
        } satisfies Partial<Record<keyof Params, unknown>>);

        expect(params.logoutUrl).toBeUndefined();
    });

    it("Should not validate breadcrumbs with non-nav origins", () => {
        const params = parseAndValidateParams({
            breadcrumbs: JSON.stringify([
                {
                    title: "test",
                    url: "https://wwwnav.no/foobar",
                },
            ]),
        } satisfies Partial<Record<keyof Params, unknown>>);

        expect(params.breadcrumbs[0].url).toBeUndefined();
    });

    it("Should not validate availableLanguages with non-nav origins", () => {
        const validateAvailableLanguage = () =>
            parseAndValidateParams({
                availableLanguages: JSON.stringify([
                    {
                        handleInApp: false,
                        url: "https://www.navno/asdf",
                        locale: "nb",
                    },
                ]),
            } satisfies Partial<Record<keyof Params, unknown>>);
        expect(validateAvailableLanguage).toThrow();
    });

    it("Should not validate logoutUrl without protocol prefix", () => {
        const params = parseAndValidateParams({
            logoutUrl: "www.nav.no",
        } satisfies Partial<Record<keyof Params, unknown>>);

        expect(params.logoutUrl).toBeUndefined();
    });
});

describe("Parsing boolean query paramters", () => {
    it('"true" should return a boolean true', () => {
        expect(parseBooleanParam("true")).toEqual(true);
    });
    it("should reflect boolean if passed directly", () => {
        expect(parseBooleanParam(true)).toEqual(true);
    });
    it("Anything else should return false", () => {
        expect(parseBooleanParam({})).toEqual(false);
        expect(parseBooleanParam([])).toEqual(false);
        expect(parseBooleanParam([1, 2, 3])).toEqual(false);
    });
});

describe("Interpolating with defaults", () => {
    it("should return the default value if the key is not present", () => {
        const params = validateParams({});

        expect(params.shareScreen).toEqual(true);
    });

    it("should override the default value if the key is present", () => {
        const params = validateParams({
            shareScreen: "false",
        });

        expect(params.shareScreen).toEqual(false);
    });
});

describe("JSON parsing", () => {
    it("should parse no breadcrumbs as an empty array", () => {
        const params = validateParams({});
        expect(params.breadcrumbs).toEqual([]);
    });

    it("should parse a stringified array of breadcrumbs", () => {
        const base = [
            {
                title: "Arbeid og opphold i Norge",
                url: "/no/person/flere-tema/arbeid-og-opphold-i-norge",
            },
            {
                title: "Medlemskap i folketrygden",
            },
        ];
        const params = validateParams(
            Object.fromEntries(
                formatParams({
                    breadcrumbs: base,
                }).entries(),
            ),
        );

        expect(params.breadcrumbs).toEqual(base);
    });
});
