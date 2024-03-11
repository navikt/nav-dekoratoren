import html from 'decorator-shared/html';
import { AvailableLanguage } from 'decorator-shared/params';
import { Texts } from 'decorator-shared/types';
import { DownChevronIcon, GlobeIcon } from 'decorator-shared/views/icons';
import cls from 'decorator-client/src/styles/language-selector.module.css';

export type LanguageSelectorProps = {
    availableLanguages: AvailableLanguage[];
    localTexts: Texts;
};

export const LanguageSelector = ({
    availableLanguages,
    localTexts
}: LanguageSelectorProps) => {
    return availableLanguages.length > 0
        ? html`
            <language-selector>
                <nav
                    class="${cls.languageSelector}"
                    aria-label="${localTexts.language_selector}"
                >
                    <button type="button" class="${cls.button}">
                        ${GlobeIcon({ className: cls.icon })}
                        <span class="${ cls.label }>
                            <span lang="nb">${'Språk'}</span>/<span lang="en">Language</span>
                        </span>
                        ${DownChevronIcon({ className: cls.icon })}
                    </button>
                </nav>
            </language-selector>`
        : null;
};
