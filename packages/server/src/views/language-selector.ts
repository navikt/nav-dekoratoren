import clsx from "clsx";
import cls from "decorator-client/src/styles/language-selector.module.css";
import utils from "decorator-client/src/styles/utils.module.css";
import { ChevronDownIcon, GlobeIcon } from "decorator-icons";
import html from "decorator-shared/html";
import { AvailableLanguage, Language } from "decorator-shared/params";
import { languageLabels } from "decorator-shared/constants";
import i18n from "../i18n";

export type LanguageSelectorProps = {
    availableLanguages: AvailableLanguage[];
    language: Language;
};

const renderLanguageOption = (
    lang: AvailableLanguage,
    currentLanguage: Language,
) => {
    const isSelected = lang.locale === currentLanguage;
    const optionClasses = clsx(cls.option, { [cls.selected]: isSelected });

    if (lang.handleInApp) {
        return html`<li>
            <button
                type="button"
                class="${optionClasses}"
                data-locale="${lang.locale}"
                aria-current="${isSelected ? "true" : "false"}"
            >
                ${languageLabels[lang.locale]}
            </button>
        </li>`;
    }

    return html`<li>
        <a
            href="${lang.url}"
            class="${optionClasses}"
            data-locale="${lang.locale}"
            aria-current="${isSelected ? "page" : "false"}"
        >
            ${languageLabels[lang.locale]}
        </a>
    </li>`;
};

export const LanguageSelector = ({
    availableLanguages,
    language,
}: LanguageSelectorProps) => html`
    <language-selector>
        <nav
            class="${clsx(cls.languageSelector, {
                [utils.hidden]: availableLanguages.length === 0,
            })}"
            aria-label="${i18n("language_selector")}"
        >
            <button
                type="button"
                class="${cls.button}"
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
                id="decorator-language-menu"
            >
                ${availableLanguages.map((lang) =>
                    renderLanguageOption(lang, language),
                )}
            </ul>
        </nav>
    </language-selector>
`;
