import { type AvailableLanguage } from 'decorator-shared/params';
import html, { json } from '../../../html';
import cls from './language-selector.module.css';

export type LanguageSelectorProps = {
  availableLanguages: AvailableLanguage[];
};

export const LanguageSelector = ({
  availableLanguages,
}: LanguageSelectorProps) =>
  availableLanguages.length > 0
    ? html`
        <language-selector class="sprakvelger ${cls.languageSelector}">
          <button>
            <span lang="nb">Språk</span>/<span lang="en">Language</span>
          </button>
          <script type="application/json">
            ${json(availableLanguages)}
          </script>
        </language-selector>
      `
    : null;
