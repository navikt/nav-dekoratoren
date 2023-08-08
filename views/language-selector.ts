import { AvailableLanguage } from '@/params';
import { html } from '../utils';

export const addEventListeners = () =>
  document
    .getElementById('language-selector')
    ?.querySelectorAll('li[data-locale][data-handle-in-app]')
    ?.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        window.postMessage({
          source: 'decorator',
          event: 'languageSelect',
          payload: {
            locale: el.getAttribute('data-locale'),
            url: el.getAttribute('data-url'),
            handleInApp: true,
          },
        });
      });
    });

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
            ({ locale, url, handleInApp }) =>
              html`<li
                data-locale="${locale}"
                data-url="${url}"
                ${handleInApp === true && 'data-handle-in-app="true"'}
              >
                ${locale}
              </li>`,
          )}
        </ul>
      `}
    </div>
  `;
}
