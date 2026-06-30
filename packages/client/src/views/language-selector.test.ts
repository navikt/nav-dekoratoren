import { describe, expect, it } from "vitest";
import { texts } from "decorator-server/src/texts";
import type { AvailableLanguage, ClientParams } from "decorator-shared/params";
import {
    LanguageSelector as LanguageSelectorTemplate,
    LanguageSelectorOption,
    languageSelectorHook,
} from "decorator-shared/views/language-selector";
import { updateDecoratorParams } from "../params";
import cls from "../styles/language-selector.module.css";
import utils from "../styles/utils.module.css";
import { LanguageSelector } from "./language-selector";

const availableLanguages = [
    { locale: "nb", handleInApp: true },
    {
        locale: "en",
        handleInApp: false,
        url: "https://www.nav.no/en/person",
    },
] satisfies AvailableLanguage[];

const params = {
    context: "privatperson",
    language: "nb",
    availableLanguages,
    breadcrumbs: [],
    utilsBackground: "transparent",
    simple: false,
    simpleHeader: false,
    simpleFooter: false,
    redirectToApp: false,
    level: "Level3",
    chatbot: true,
    chatbotVisible: false,
    shareScreen: true,
    logoutWarning: true,
    feedback: false,
    ssrMainMenu: false,
    redirectOnUserChange: false,
    analyticsQueryParams: [],
    analyticsRedactFilter: [],
} satisfies ClientParams;

const defineLanguageSelector = () => {
    if (!customElements.get("language-selector")) {
        customElements.define("language-selector", LanguageSelector);
    }
};

const setDecoratorData = (paramsOverrides: Partial<ClientParams> = {}) => {
    window.__DECORATOR_DATA__ = {
        params: {
            ...params,
            ...paramsOverrides,
        },
        env: {
            APP_URL: "http://localhost:8089",
            CDN_URL: "http://localhost:8089",
            BOOST_ENV: "nav",
            LOGIN_SESSION_API_URL: "http://localhost:8089/auth",
            LOGOUT_URL: "http://localhost:8089/logout",
            MIN_SIDE_ARBEIDSGIVER_URL: "https://arbeidsgiver.nav.no/min-side",
            MIN_SIDE_URL: "https://www.nav.no/minside",
            PUZZEL_CUSTOMER_ID: "nav",
            VERSION_ID: "test",
            XP_BASE_URL: "https://www.nav.no",
        },
        features: {
            "dekoratoren.skjermdeling": false,
            "dekoratoren.chatbotscript": false,
            "dekoratoren.umami": false,
            "dekoratoren.puzzel-script": false,
        },
        texts: texts.nb,
        allowedStorage: [],
    };
};

const expectedMenuHtml = () => {
    const template = document.createElement("template");
    template.innerHTML = availableLanguages
        .map((language) =>
            LanguageSelectorOption({
                language,
                currentLanguage: "nb",
            }).render({ language: "nb" }),
        )
        .join("");

    return template.innerHTML;
};

describe("LanguageSelector", () => {
    it("regenerates menu options with the shared server renderer", () => {
        setDecoratorData();
        document.body.innerHTML = "";
        defineLanguageSelector();

        const element = document.createElement(
            "language-selector",
        ) as LanguageSelector;
        element.innerHTML = `
            <nav
                class="${cls.languageSelector}"
                data-hydrate="${languageSelectorHook.container}"
                aria-label="Språk"
            >
                <button
                    type="button"
                    class="${cls.button}"
                    data-hydrate="${languageSelectorHook.trigger}"
                    aria-expanded="false"
                    aria-controls="decorator-language-menu"
                >
                    Språk/Language
                </button>
                <ul
                    class="${cls.menu} ${utils.hidden}"
                    data-hydrate="${languageSelectorHook.menu}"
                    id="decorator-language-menu"
                ></ul>
            </nav>
        `;

        document.body.appendChild(element);

        const menu = element.querySelector("#decorator-language-menu");
        expect(menu?.innerHTML).toBe(expectedMenuHtml());
        expect(element.options).toHaveLength(availableLanguages.length);
    });

    it("hydrates server-rendered options and updates selection state", () => {
        setDecoratorData();
        document.body.innerHTML = "";
        defineLanguageSelector();

        const postMessage = vi
            .spyOn(window, "postMessage")
            .mockImplementation(() => undefined);

        const template = document.createElement("template");
        template.innerHTML = LanguageSelectorTemplate({
            availableLanguages,
            language: "nb",
            label: { render: () => "Språk" },
        }).render({ language: "nb" });
        const element = template.content.firstElementChild as LanguageSelector;

        document.body.appendChild(element);

        const nbButton = element.querySelector<HTMLButtonElement>(
            'button[data-locale="nb"]',
        );
        const enLink = element.querySelector<HTMLAnchorElement>(
            'a[data-locale="en"]',
        );

        expect(element.options).toHaveLength(availableLanguages.length);
        expect(nbButton?.classList.contains(cls.selected)).toBe(true);
        expect(nbButton?.getAttribute("aria-current")).toBe("true");
        expect(enLink?.href).toBe("https://www.nav.no/en/person");
        expect(enLink?.getAttribute("aria-current")).toBe("false");

        updateDecoratorParams({ language: "en" });

        expect(nbButton?.classList.contains(cls.selected)).toBe(false);
        expect(nbButton?.getAttribute("aria-current")).toBe("false");
        expect(enLink?.classList.contains(cls.selected)).toBe(true);
        expect(enLink?.getAttribute("aria-current")).toBe("page");

        nbButton?.click();

        expect(window.__DECORATOR_DATA__.params.language).toBe("nb");
        expect(postMessage).toHaveBeenCalledWith({
            source: "decorator",
            event: "languageSelect",
            payload: availableLanguages[0],
        });
    });

    it("regenerates and hydrates options when available languages change", () => {
        setDecoratorData({
            availableLanguages: [],
        });
        document.body.innerHTML = "";
        defineLanguageSelector();

        const template = document.createElement("template");
        template.innerHTML = LanguageSelectorTemplate({
            availableLanguages: [],
            language: "nb",
            label: { render: () => "Språk" },
        }).render({ language: "nb" });
        const element = template.content.firstElementChild as LanguageSelector;

        document.body.appendChild(element);
        expect(element.options).toHaveLength(0);

        updateDecoratorParams({ availableLanguages });

        expect(element.options).toHaveLength(availableLanguages.length);
        expect(
            element.querySelector<HTMLButtonElement>(
                'button[data-locale="nb"]',
            ),
        ).not.toBeNull();
        expect(
            element.querySelector<HTMLAnchorElement>('a[data-locale="en"]')
                ?.href,
        ).toBe("https://www.nav.no/en/person");
    });
});
