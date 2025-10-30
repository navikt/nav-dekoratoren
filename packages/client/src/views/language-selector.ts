import { type AvailableLanguage, type Language } from "decorator-shared/params";
import { languageLabels } from "decorator-shared/constants";
import { CustomEvents } from "../events";
import { param, updateDecoratorParams } from "../params";
import cls from "../styles/language-selector.module.css";
import utils from "../styles/utils.module.css";
import { defineCustomElement } from "./custom-elements";
import { analyticsEvent } from "../analytics/analytics";

export class LanguageSelector extends HTMLElement {
    menu!: HTMLElement;
    container!: HTMLDivElement;
    button!: HTMLButtonElement;
    #open = false;
    options: (HTMLAnchorElement | HTMLButtonElement)[] = [];
    #language?: Language;

    set language(language: Language) {
        for (const option of this.options) {
            option.classList.toggle(
                cls.selected,
                option.dataset.locale === language,
            );
        }
        this.#language = language;
    }

    set availableLanguages(availableLanguages: AvailableLanguage[]) {
        if (this.options.length === 0 && this.menu?.children.length > 0) {
            this.hydrateFromDOM(availableLanguages);
        } else {
            this.regenerateMenu(availableLanguages);
        }

        this.container.classList.toggle(
            utils.hidden,
            availableLanguages.length === 0,
        );
    }

    private sendLanguageSelectAnalytics(locale: Language) {
        analyticsEvent({
            context: window.__DECORATOR_DATA__.params.context,
            eventName: "navigere",
            kategori: "dekorator-sprakvelger",
            lenketekst: languageLabels[locale],
            komponent: "LanguageSelector",
        });
    }

    private hydrateFromDOM(availableLanguages: AvailableLanguage[]) {
        this.options = [];
        const listItems = this.menu.querySelectorAll("li");

        for (const li of listItems) {
            const option = li.querySelector("button, a") as
                | HTMLButtonElement
                | HTMLAnchorElement;
            if (!option) continue;

            const locale = option.dataset.locale;
            if (!locale) continue;

            const language = availableLanguages.find(
                (lang) => lang.locale === locale,
            );
            if (!language) continue;

            if (option.tagName === "BUTTON") {
                option.addEventListener("click", (e) => {
                    e.preventDefault();
                    updateDecoratorParams({ language: locale as Language });
                    window.postMessage({
                        source: "decorator",
                        event: "languageSelect",
                        payload: language,
                    });
                    this.sendLanguageSelectAnalytics(locale as Language);
                    this.open = false;
                });
            }

            option.addEventListener("blur", this.onBlur as EventListener);
            this.options.push(option);
        }
    }

    private regenerateMenu(availableLanguages: AvailableLanguage[]) {
        const availableLanguageToLi = (language: AvailableLanguage) => {
            const li = document.createElement("li");
            let option: HTMLAnchorElement | HTMLButtonElement;

            if (language.handleInApp) {
                option = document.createElement("button");

                option.addEventListener("click", (e) => {
                    e.preventDefault();
                    updateDecoratorParams({ language: language.locale });
                    window.postMessage({
                        source: "decorator",
                        event: "languageSelect",
                        payload: language,
                    });
                    this.sendLanguageSelectAnalytics(language.locale);
                    this.open = false;
                });
                option.addEventListener("blur", this.onBlur);
                option.setAttribute(
                    "aria-current",
                    language.locale === this.#language ? "true" : "false",
                );
            } else {
                option = document.createElement("a");
                option.href = language.url;
                option.addEventListener("blur", this.onBlur);
                option.setAttribute(
                    "aria-current",
                    language.locale === this.#language ? "page" : "false",
                );
            }
            option.classList.add(cls.option);
            option.setAttribute("data-locale", language.locale);
            option.classList.toggle(
                cls.selected,
                language.locale === this.#language,
            );
            option.innerHTML = languageLabels[language.locale];
            this.options.push(option);
            li.appendChild(option);
            return li;
        };

        this.options = [];
        this.menu.replaceChildren(
            ...availableLanguages.map(availableLanguageToLi),
        );
    }

    connectedCallback() {
        this.container = this.querySelector(`.${cls.languageSelector}`)!;

        const existingMenu = this.container.querySelector("ul");
        if (existingMenu) {
            this.menu = existingMenu as HTMLElement;
        } else {
            this.menu = document.createElement("ul");
            this.menu.classList.add(cls.menu, utils.hidden);
            this.menu.setAttribute("role", "menu");
            this.menu.id = "decorator-language-menu";
            this.container.appendChild(this.menu);
        }

        this.button = this.querySelector(`.${cls.button}`) as HTMLButtonElement;
        this.button.addEventListener("click", () => {
            this.open = !this.#open;
        });
        this.button.addEventListener("blur", this.onBlur);

        this.addEventListener("keyup", (e) => {
            if (e.key === "Escape") {
                this.open = false;
            }
        });

        window.addEventListener("paramsupdated", this.handleParamsUpdated);
        this.language = param("language");
        this.availableLanguages = param("availableLanguages");
    }

    disconnectedCallback() {
        window.removeEventListener("paramsupdated", this.handleParamsUpdated);
    }

    handleParamsUpdated = (
        event: CustomEvent<CustomEvents["paramsupdated"]>,
    ) => {
        if (event.detail.params.language) {
            this.language = event.detail.params.language;
        }
        if (event.detail.params.availableLanguages) {
            this.availableLanguages = event.detail.params.availableLanguages;
        }
    };

    onBlur = (e: FocusEvent) => {
        if (
            e.relatedTarget === null ||
            !this.contains(e.relatedTarget as Node)
        ) {
            this.open = false;
        }
    };

    set open(open: boolean) {
        this.#open = open;
        this.menu.classList.toggle(utils.hidden, !open);
        this.button.setAttribute("aria-expanded", String(open));
        analyticsEvent({
            eventName: open ? "accordion åpnet" : "accordion lukket",
            context: window.__DECORATOR_DATA__.params.context,
            kategori: "dekorator-sprakvelger",
            lenketekst: "Språk/Language",
            komponent: "LanguageSelector",
        });
    }
}

defineCustomElement("language-selector", LanguageSelector);
