import { AvailableLanguage } from 'decorator-shared/params';
import cls from 'decorator-shared/views/header/decorator-utils-container/language-selector.module.css';

declare global {
  interface HTMLElementTagNameMap {
    'language-selector': LanguageSelector;
  }
}

export class LanguageSelector extends HTMLElement {
  menu;
  button;
  #open = false;

  set availableLanguages(availableLanguages: AvailableLanguage[]) {
    const availableLanguageToLi = (language: AvailableLanguage) => {
      const li = document.createElement('li');
      let option: HTMLAnchorElement | HTMLButtonElement;
      if (language.handleInApp) {
        option = document.createElement('button');

        option.addEventListener('click', (e) => {
          e.preventDefault();

          window.postMessage({
            source: 'decorator',
            event: 'languageSelect',
            payload: language,
          });
          this.open = false;
        });
        option.addEventListener('blur', this.onBlur);
      } else {
        option = document.createElement('a');
        option.href = language.url;
        option.addEventListener('blur', this.onBlur);
      }
      option.classList.add(cls.option);
      option.classList.toggle(
        cls.selected,
        language.locale === window.__DECORATOR_DATA__.params.language,
      );
      li.appendChild(option);
      option.innerHTML = {
        nb: 'Norsk (bokmål)',
        nn: 'Norsk (nynorsk)',
        en: 'English',
        se: 'Sámegiel',
        pl: 'Polski',
        uk: 'Українська',
        ru: 'Русский',
      }[language.locale];
      return li;
    };

    this.menu.replaceChildren(...availableLanguages.map(availableLanguageToLi));
  }

  constructor() {
    super();
    this.menu = document.createElement('ul');
    this.menu.classList.add(cls.menu, cls.hidden);
    this.appendChild(this.menu);

    this.button = this.querySelector('button') as HTMLButtonElement;
  }

  connectedCallback() {
    this.button.addEventListener('click', () => {
      this.open = !this.#open;
    });

    this.availableLanguages =
      window.__DECORATOR_DATA__.params.availableLanguages;

    this.button.addEventListener('blur', this.onBlur);
    this.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        this.open = false;
      }
    });
  }

  onBlur = (e: FocusEvent) => {
    if (e.relatedTarget === null || !this.contains(e.relatedTarget as Node)) {
      this.open = false;
    }
  };

  set open(open: boolean) {
    this.#open = open;
    this.menu.classList.toggle(cls.hidden, !open);
  }
}

customElements.define('language-selector', LanguageSelector, {
  extends: 'nav',
});
