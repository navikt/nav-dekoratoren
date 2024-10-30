import {
    AvailableLanguage,
    Language,
    languageLabels,
} from "decorator-shared/params";
import { CustomEvents } from "../events";
import { param, updateDecoratorParams } from "../params";
import cls from "../styles/language-selector.module.css";
import utils from "../styles/utils.module.css";
import { defineCustomElement } from "./custom-elements";
import { amplitudeEvent } from "../analytics/amplitude";

export class LanguageSelector extends HTMLElement {
    menu!: HTMLElement;
    container!: HTMLDivElement;
    #open = false;
    options: (HTMLAnchorElement | HTMLButtonElement)[] = [];
    #language?: Language;

    set language(language: Language) {
        const { params } = window.__DECORATOR_DATA__;

        this.options.forEach((option) => {
            option.classList.toggle(
                cls.selected,
                option.getAttribute("data-locale") === language,
            );
        });
        this.#language = language;

        amplitudeEvent({
            eventName: "navigere",
            context: params.context,
            label: languageLabels[language],
            category: "dekorator-sprakvelger",
            komponent: "LanguageSelector",
        });
    }

    set availableLanguages(availableLanguages: AvailableLanguage[]) {
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
                    this.open = false;
                });
                option.addEventListener("blur", this.onBlur);
            } else {
                option = document.createElement("a");
                option.href = language.url;
                option.addEventListener("blur", this.onBlur);
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
        this.container.classList.toggle(
            utils.hidden,
            availableLanguages.length === 0,
        );
        this.menu.replaceChildren(
            ...availableLanguages.map(availableLanguageToLi),
        );
    }

    connectedCallback() {
        this.menu = document.createElement("ul");
        this.menu.classList.add(cls.menu, utils.hidden);

        this.container = this.querySelector(`.${cls.languageSelector}`)!;
        this.container.appendChild(this.menu);

        const button = this.querySelector(
            `.${cls.button}`,
        ) as HTMLButtonElement;
        button.addEventListener("click", () => {
            this.open = !this.#open;
        });
        button.addEventListener("blur", this.onBlur);

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
        const { params } = window.__DECORATOR_DATA__;
        this.#open = open;
        this.menu.classList.toggle(utils.hidden, !open);
        amplitudeEvent({
            eventName: open ? "accordion åpnet" : "accordion lukket",
            context: params.context,
            label: "Språk/Language",
            category: "dekorator-sprakvelger",
            komponent: "LanguageSelector",
        });
    }
}

defineCustomElement("language-selector", LanguageSelector);
