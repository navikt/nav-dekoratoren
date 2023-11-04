import { LanguageSelector } from './language-selector';
import utilsCls from 'decorator-shared/utilities.module.css';
import cls from './decorator-utils.module.css';
import { UtilsBackground } from 'decorator-shared/params';
import { Breadcrumbs } from 'decorator-shared/views/header/decorator-utils-container/breadcrumbs';

class DecoratorUtils extends HTMLElement {
  languageSelector: LanguageSelector;
  breadbrumbs: HTMLElement;

  constructor() {
    super();

    this.classList.add(utilsCls.contentContainer, cls.decoratorUtils);

    this.languageSelector =
      this.querySelector('nav[is="language-selector"]') ??
      new LanguageSelector();

    if (this.querySelector('nav[is="d-breadcrumbs"]')) {
      this.breadbrumbs = this.querySelector(
        'nav[is="d-breadcrumbs"]',
      ) as HTMLElement;
    } else {
      this.breadbrumbs = document.createElement('nav');
    }
  }

  update = () => {
    const { availableLanguages, language, breadcrumbs, utilsBackground } =
      window.__DECORATOR_DATA__.params;

    this.classList.toggle(
      cls.empty,
      availableLanguages.length === 0 && breadcrumbs.length === 0,
    );

    this.languageSelector.availableLanguages = availableLanguages;
    if (
      availableLanguages.length > 0 &&
      !this.contains(this.languageSelector)
    ) {
      this.append(this.languageSelector);
    } else if (availableLanguages.length === 0) {
      this.languageSelector.remove();
    }

    this.languageSelector.language = language;

    this.breadbrumbs.innerHTML = Breadcrumbs({ breadcrumbs }).render();
    if (breadcrumbs.length > 0 && !this.contains(this.breadbrumbs)) {
      this.prepend(this.breadbrumbs);
    } else if (breadcrumbs.length === 0) {
      this.breadbrumbs.remove();
    }

    this.utilsBackground = utilsBackground;
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
