import { UtilsBackground } from 'decorator-shared/params';
import { Breadcrumbs } from 'decorator-shared/views/header/decorator-utils-container/breadcrumbs';
import cls from './decorator-utils.module.css';
import { LanguageSelector } from './language-selector';

class DecoratorUtils extends HTMLElement {
  languageSelector: LanguageSelector;
  breadbrumbs: HTMLElement;

  constructor() {
    super();

    this.languageSelector = this.querySelector(
      'nav[is="language-selector"]',
    ) as LanguageSelector;
    this.breadbrumbs = this.querySelector(
      'nav[is="d-breadcrumbs"]',
    ) as HTMLElement;
  }

  update = () => {
    const { availableLanguages, language, breadcrumbs, utilsBackground } =
      window.__DECORATOR_DATA__.params;

    this.classList.toggle(
      cls.empty,
      availableLanguages.length === 0 && breadcrumbs.length === 0,
    );
    this.utilsBackground = utilsBackground;

    this.languageSelector.availableLanguages = availableLanguages;
    this.languageSelector.language = language;
    this.breadbrumbs.innerHTML = Breadcrumbs({ breadcrumbs })?.render() ?? '';
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
