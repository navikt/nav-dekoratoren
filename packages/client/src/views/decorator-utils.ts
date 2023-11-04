import { LanguageSelector } from './language-selector';
import utilsCls from 'decorator-shared/utilities.module.css';
import cls from './decorator-utils.module.css';
import { UtilsBackground } from 'decorator-shared/params';

class DecoratorUtils extends HTMLElement {
  languageSelector: LanguageSelector;

  constructor() {
    super();

    this.languageSelector = document.createElement('nav', {
      is: 'language-selector',
    }) as LanguageSelector;

    this.classList.add(utilsCls.contentContainer, cls.decoratorUtils);
  }

  update = () => {
    const { availableLanguages, language, utilsBackground } =
      window.__DECORATOR_DATA__.params;

    if (availableLanguages) {
      this.languageSelector.availableLanguages = availableLanguages;
      this.appendChild(this.languageSelector);
    }
    if (language) {
      this.languageSelector.language = language;
    }
    if (utilsBackground) {
      this.utilsBackground = utilsBackground;
    }
  };

  set utilsBackground(utilsBackground: UtilsBackground) {
    this.classList.toggle(cls.white, utilsBackground === 'white');
    this.classList.toggle(cls.gray, utilsBackground === 'gray');
  }

  connectedCallback() {
    window.addEventListener('paramsupdated', this.update);
  }
}

customElements.define('decorator-utils', DecoratorUtils);
