import cls from "decorator-client/src/styles/language-selector.module.css";
import html from "decorator-shared/html";
import { AvailableLanguage } from "decorator-shared/params";
import { Texts } from "decorator-shared/types";
import { DownChevronIcon, GlobeIcon } from "decorator-shared/views/icons";

export type LanguageSelectorProps = {
    availableLanguages: AvailableLanguage[];
    texts: Texts;
};

export const LanguageSelector = ({
    availableLanguages,
    texts,
}: LanguageSelectorProps) => html`
    <language-selector>
        ${availableLanguages.length > 0 &&
        html`
            <nav
                class="${cls.languageSelector}"
                aria-label="${texts.language_selector}"
            >
                <button type="button" class="${cls.button}">
                    ${GlobeIcon({ className: cls.icon })}
                    <span class="${cls.label}">
                        <span lang="nb">${"Språk"}</span>/
                        <span lang="en">Language</span>
                    </span>
                    ${DownChevronIcon({ className: cls.icon })}
                </button>
            </nav>
        `}
    </language-selector>
`;
