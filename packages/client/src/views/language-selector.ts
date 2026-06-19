import { type AvailableLanguage, type Language } from "decorator-shared/params";
import { languageLabels } from "decorator-shared/constants";
import html from "decorator-shared/html";
import {
    LanguageSelectorOption,
    languageSelectorSelector,
} from "decorator-shared/views/language-selector";
import { CustomEvents } from "../events";
import { getRequiredElement, templateToFragment } from "../helpers/dom";
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
    #hydrated = false;

    set language(language: Language) {
        for (const option of this.options) {
            const isSelected = option.dataset.locale === language;
            option.classList.toggle(cls.selected, isSelected);
            option.setAttribute(
                "aria-current",
                isSelected
                    ? option instanceof HTMLAnchorElement
                        ? "page"
                        : "true"
                    : "false",
            );
        }
        this.#language = language;
    }

    set availableLanguages(availableLanguages: AvailableLanguage[]) {
        if (!this.#hydrated && this.menu?.children.length > 0) {
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
        const options = this.menu.querySelectorAll(
            languageSelectorSelector.option,
        );

        for (const option of options) {
            if (
                !(option instanceof HTMLButtonElement) &&
                !(option instanceof HTMLAnchorElement)
            ) {
                continue;
            }
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
        this.#hydrated = true;
    }

    private regenerateMenu(availableLanguages: AvailableLanguage[]) {
        const fragment = templateToFragment(
            html`${availableLanguages.map((language) =>
                LanguageSelectorOption({
                    language,
                    currentLanguage: this.#language,
                }),
            )}`,
            this.#language ?? "nb",
        );

        this.menu.replaceChildren(...fragment.childNodes);
        this.hydrateFromDOM(availableLanguages);
    }

    connectedCallback() {
        this.container = getRequiredElement<HTMLDivElement>(
            this,
            languageSelectorSelector.container,
        );
        this.menu = getRequiredElement<HTMLElement>(
            this.container,
            languageSelectorSelector.menu,
        );
        this.button = getRequiredElement<HTMLButtonElement>(
            this,
            languageSelectorSelector.trigger,
        );
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
        const { changedKeys, params } = event.detail;
        if (changedKeys.includes("language")) {
            this.language = params.language;
        }
        if (changedKeys.includes("availableLanguages")) {
            this.availableLanguages = params.availableLanguages;
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
