import clsx from "clsx";
import cls from "decorator-client/src/styles/language-selector.module.css";
import html from "decorator-shared/html";
import { AvailableLanguage } from "decorator-shared/params";
import { DownChevronIcon, GlobeIcon } from "decorator-shared/views/icons";
import i18n from "../i18n";

export type LanguageSelectorProps = {
    availableLanguages: AvailableLanguage[];
};

export const LanguageSelector = ({
    availableLanguages,
}: LanguageSelectorProps) => html`
    <language-selector>
        <nav
            class="${clsx(cls.languageSelector, {
                [cls.empty]: availableLanguages.length === 0,
            })}"
            aria-label="${i18n("language_selector")}"
        >
            <button type="button" class="${cls.button}">
                ${GlobeIcon({ className: cls.icon })}
                <span class="${cls.label}">
                    <span lang="nb">${"Språk"}</span>/<span lang="en"
                        >Language</span
                    >
                </span>
                ${DownChevronIcon({ className: cls.icon })}
            </button>
        </nav>
    </language-selector>
`;
