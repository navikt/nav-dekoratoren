import clsx from "clsx";
import cls from "decorator-client/src/styles/language-selector.module.css";
import utils from "decorator-client/src/styles/utils.module.css";
import { ChevronDownIcon, GlobeIcon } from "decorator-icons";
import html, { type Template } from "../html";
import { languageLabels } from "../constants";
import type { AvailableLanguage, Language } from "../params";
import { defineHydrationHooks, hydrateAttr } from "../hydration";

export const [languageSelectorHook, languageSelectorSelector] =
    defineHydrationHooks({
        container: "lang.container",
        trigger: "lang.trigger",
        menu: "lang.menu",
        option: "lang.option",
    });

export const LanguageSelectorOption = ({
    language,
    currentLanguage,
}: {
    language: AvailableLanguage;
    currentLanguage?: Language;
}) => {
    const isSelected = language.locale === currentLanguage;
    const optionClasses = clsx(cls.option, { [cls.selected]: isSelected });

    if (language.handleInApp) {
        return html`<li>
            <button
                type="button"
                class="${optionClasses}"
                ${hydrateAttr(languageSelectorHook.option)}
                data-locale="${language.locale}"
                aria-current="${isSelected ? "true" : "false"}"
            >
                ${languageLabels[language.locale]}
            </button>
        </li>`;
    }

    return html`<li>
        <a
            href="${language.url}"
            class="${optionClasses}"
            ${hydrateAttr(languageSelectorHook.option)}
            data-locale="${language.locale}"
            aria-current="${isSelected ? "page" : "false"}"
        >
            ${languageLabels[language.locale]}
        </a>
    </li>`;
};

export const LanguageSelector = ({
    availableLanguages,
    language,
    label,
}: {
    availableLanguages: AvailableLanguage[];
    language: Language;
    label: Template;
}) => html`
    <language-selector>
        <nav
            class="${clsx(cls.languageSelector, {
                [utils.hidden]: availableLanguages.length === 0,
            })}"
            ${hydrateAttr(languageSelectorHook.container)}
            aria-label="${label}"
        >
            <button
                type="button"
                class="${cls.button}"
                ${hydrateAttr(languageSelectorHook.trigger)}
                aria-expanded="false"
                aria-controls="decorator-language-menu"
            >
                ${GlobeIcon({ className: utils.icon })}
                <span class="${cls.label}">
                    <span lang="nb">Språk</span>/<span lang="en">Language</span>
                </span>
                ${ChevronDownIcon({ className: utils.icon })}
            </button>
            <ul
                class="${clsx(cls.menu, utils.hidden)}"
                ${hydrateAttr(languageSelectorHook.menu)}
                id="decorator-language-menu"
            >
                ${availableLanguages.map((lang) =>
                    LanguageSelectorOption({
                        language: lang,
                        currentLanguage: language,
                    }),
                )}
            </ul>
        </nav>
    </language-selector>
`;
