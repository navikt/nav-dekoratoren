import { AvailableLanguage } from 'decorator-shared/params';

declare global {
  interface HTMLElementTagNameMap {
    'language-selector': LanguageSelector;
  }
}

export class LanguageSelector extends HTMLElement {
  menu;

  set availableLanguages(availableLanguages: AvailableLanguage[]) {
    const availableLanguageToLi = (availableLanguage: AvailableLanguage) => {
      const li = document.createElement('li');
      li.innerHTML = {
        nb: 'Norsk (bokmål)',
        nn: 'Norsk (nynorsk)',
        en: 'English',
        se: 'Sámegiel',
        pl: 'Polski',
        uk: 'Українська',
        ru: 'Русский',
      }[availableLanguage.locale];

      if (availableLanguage.handleInApp) {
        li.addEventListener('click', (e) => {
          e.preventDefault();

          window.postMessage({
            source: 'decorator',
            event: 'languageSelect',
            payload: availableLanguage,
          });
        });
      }
      return li;
    };

    const ul = document.createElement('ul');
    ul.append(...availableLanguages.map(availableLanguageToLi));

    this.menu.replaceChildren(ul);
  }

  constructor() {
    super();
    this.menu = document.createElement('div');
    this.menu.classList.add('decorator-language-selector-menu');
    this.menu.classList.add('hidden');
    this.appendChild(this.menu);

    const handleClickOutside = (e: Event) => {
      if (
        !e
          .composedPath()
          .some((el) => el === document.getElementById('language-selector'))
      ) {
        this.menu.classList.add('hidden');
        window.removeEventListener('click', handleClickOutside);
      }
    };

    this.querySelector('button')?.addEventListener('click', () => {
      if (this.menu.classList.contains('hidden')) {
        window.addEventListener('click', handleClickOutside);
      } else {
        window.removeEventListener('click', handleClickOutside);
      }

      this.menu.classList.toggle('hidden');
    });

    // Vet ikke om dette er beste måten å SSRe objekter. web.dev sier:
    // "Aim to only accept rich data (objects, arrays) as properties.",
    // https://web.dev/custom-elements-best-practices/#attributes-and-properties
    this.availableLanguages = JSON.parse(
      this.querySelector('script')?.innerHTML ?? '[]',
    );
  }
}

customElements.define('language-selector', LanguageSelector);
