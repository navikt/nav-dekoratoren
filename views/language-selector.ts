import { AvailableLanguage } from '@/params';
import { html } from '../utils';

export default function LanguageSelector({
  availableLanguages,
}: {
  availableLanguages: AvailableLanguage[];
}) {
  return html`
    <div id="language-selector">
      ${availableLanguages.length > 0 &&
      html`
        <ul>
          ${availableLanguages.map(
            (lang) =>
              html`<li data-locale="${lang.locale}">${lang.locale}</li>`,
          )}
        </ul>
      `}
    </div>
  `;
}
