import { UtilsBackground } from 'decorator-shared/params';
import { Breadcrumbs } from 'decorator-shared/views/breadcrumbs';
import cls from '../styles/decorator-utils.module.css';

import { LanguageSelector } from './language-selector';

class DecoratorUtils extends HTMLElement {
    languageSelector: LanguageSelector;
    breadcrumbs: HTMLElement;

    constructor() {
        super();

        this.languageSelector = this.querySelector(':scope > language-selector')!;
        this.breadcrumbs = this.querySelector(':scope > breadcrumbs')!;
    }

    update = () => {
        const { availableLanguages, language, breadcrumbs, utilsBackground } = window.__DECORATOR_DATA__.params;
        const label = window.__DECORATOR_DATA__.texts.breadcrumbs;

        this.classList.toggle(cls.hidden, availableLanguages.length === 0 && breadcrumbs.length === 0);
        this.utilsBackground = utilsBackground;

        this.languageSelector.availableLanguages = availableLanguages;
        this.languageSelector.language = language;
        this.breadcrumbs.innerHTML = Breadcrumbs({ breadcrumbs, label })?.render() ?? '';
    };

    set utilsBackground(utilsBackground: UtilsBackground) {
        this.classList.toggle(cls.white, utilsBackground === 'white');
        this.classList.toggle(cls.gray, utilsBackground === 'gray');
    }

    connectedCallback() {
        window.addEventListener('paramsupdated', this.update);
        setTimeout(this.update, 0);
    }

    disconnectedCallback() {
        window.removeEventListener('paramsupdated', this.update);
    }
}

customElements.define('decorator-utils', DecoratorUtils);
