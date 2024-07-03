import { AvailableLanguage, Language } from "decorator-shared/params";
import cls from "../styles/language-selector.module.css";
import { updateDecoratorParams } from "../params";
import { addCustomElement } from "../custom-elements";

declare global {
    interface HTMLElementTagNameMap {
        "language-selector": LanguageSelector;
    }
}

export class LanguageSelector extends HTMLElement {
    menu!: HTMLElement;
    container!: HTMLDivElement;
    button!: HTMLButtonElement;
    #open = false;
    options: (HTMLAnchorElement | HTMLButtonElement)[] = [];
    #language?: Language;

    set language(language: Language) {
        this.options.forEach((option) => {
            option.classList.toggle(
                cls.selected,
                option.getAttribute("data-locale") === language,
            );
        });
        this.#language = language;
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
            option.innerHTML = {
                nb: "Norsk (bokmål)",
                nn: "Norsk (nynorsk)",
                en: "English",
                se: "Sámegiel (samisk)",
                pl: "Polski (polsk)",
                uk: "Українська (ukrainsk)",
                ru: "Русский (russisk)",
            }[language.locale];
            this.options.push(option);
            li.appendChild(option);
            return li;
        };

        this.options = [];
        this.container.classList.toggle(
            cls.empty,
            availableLanguages.length === 0,
        );
        this.menu.replaceChildren(
            ...availableLanguages.map(availableLanguageToLi),
        );
    }

    connectedCallback() {
        this.button = this.querySelector(`.${cls.button}`)!;
        this.container = this.querySelector(`.${cls.languageSelector}`)!;
        this.menu = document.createElement("ul");
        this.menu.classList.add(cls.menu, cls.hidden);
        this.container.appendChild(this.menu);

        this.button.addEventListener("click", () => {
            this.open = !this.#open;
        });
        this.button.addEventListener("blur", this.onBlur);
        this.addEventListener("keyup", (e) => {
            if (e.key === "Escape") {
                this.open = false;
            }
        });
    }

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
        this.menu.classList.toggle(cls.hidden, !open);
    }
}

addCustomElement("language-selector", LanguageSelector);
