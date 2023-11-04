import html from 'decorator-shared/html';
import { AvailableLanguage, Language } from 'decorator-shared/params';
import cls from 'decorator-shared/views/header/decorator-utils-container/language-selector.module.css';
import { DownChevronIcon, GlobeIcon } from 'decorator-shared/views/icons';

declare global {
  interface HTMLElementTagNameMap {
    'language-selector': LanguageSelector;
  }
}

export class LanguageSelector extends HTMLElement {
  menu;
  button: HTMLButtonElement;
  #open = false;
  options: (HTMLAnchorElement | HTMLButtonElement)[] = [];
  #language?: Language;

  set language(language: Language) {
    this.options.forEach((option) => {
      option.classList.toggle(
        cls.selected,
        option.getAttribute('data-locale') === language,
      );
    });
    this.#language = language;
  }

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
      option.setAttribute('data-locale', language.locale);
      option.classList.toggle(cls.selected, language.locale === this.#language);
      option.innerHTML = {
        nb: 'Norsk (bokmål)',
        nn: 'Norsk (nynorsk)',
        en: 'English',
        se: 'Sámegiel',
        pl: 'Polski',
        uk: 'Українська',
        ru: 'Русский',
      }[language.locale];
      this.options.push(option);
      li.appendChild(option);
      return li;
    };

    this.options = [];
    this.menu.replaceChildren(...availableLanguages.map(availableLanguageToLi));
  }

  constructor() {
    super();

    this.classList.add(cls.languageSelector);

    if (this.querySelector(`.${cls.button}`)) {
      this.button = this.querySelector(`.${cls.button}`) as HTMLButtonElement;
    } else {
      this.button = document.createElement('button');
      this.button.type = 'button';
      this.button.classList.add(cls.button);
      this.button.innerHTML = html`
        ${GlobeIcon({ className: cls.icon })}
        <span>
          <span lang="nb">Språk</span>/<span lang="en">Language</span>
        </span>
        ${DownChevronIcon({ className: cls.icon })}
      `.render();
      this.appendChild(this.button);
    }

    this.menu = document.createElement('ul');
    this.menu.classList.add(cls.menu, cls.hidden);
    this.appendChild(this.menu);
  }

  connectedCallback() {
    this.button.addEventListener('click', () => {
      this.open = !this.#open;
    });

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
