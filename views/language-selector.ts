import { AvailableLanguage } from '@/params';
import { html } from '../utils';

export const addEventListeners = () => {
  const button = document.querySelector('.decorator-language-selector-button');
  const menu = document.querySelector('.decorator-language-selector-menu');

  const handleClickOutside = (e: Event) => {
    if (
      !e
        .composedPath()
        .some((el) => el === document.getElementById('language-selector'))
    ) {
      menu?.classList.add('hidden');
      window.removeEventListener('click', handleClickOutside);
    }
  };

  button?.addEventListener('click', () => {
    if (menu?.classList.contains('hidden')) {
      window.addEventListener('click', handleClickOutside);
    } else {
      window.removeEventListener('click', handleClickOutside);
    }

    menu?.classList.toggle('hidden');
  });

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
};

const languageLabels = {
  nb: 'Norsk (bokmål)',
  nn: 'Norsk (nynorsk)',
  en: 'English',
  se: 'Sámegiel',
  pl: 'Polski',
  uk: 'Українська',
  ru: 'Русский',
};

export default function LanguageSelector({
  availableLanguages,
}: {
  availableLanguages: AvailableLanguage[];
}) {
  return html`
    <div id="language-selector" class="sprakvelger">
      <button class="decorator-language-selector-button">
        <span lang="nb">Språk</span>/<span lang="en">Language</span>
      </button>
      <div class="decorator-language-selector-menu hidden">
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
                  ${languageLabels[locale]}
                </li>`,
            )}
          </ul>
        `}
      </div>
    </div>
  `;
}
