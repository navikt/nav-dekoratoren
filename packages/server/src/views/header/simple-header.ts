import html from 'decorator-shared/html';
import type {
  AvailableLanguage,
  Breadcrumb,
  UtilsBackground,
} from 'decorator-shared/params';
import { Texts } from 'decorator-shared/types';
import cls from 'decorator-shared/utilities.module.css';
import { Breadcrumbs } from 'decorator-shared/views/breadcrumbs';
import { SimpleHeaderNavbarItems } from 'decorator-shared/views/header/navbar-items/simple-header-navbar-items';
import LanguageSelector from 'decorator-shared/views/language-selector';

const utilsBackgroundClasses = {
  white: 'decorator-utils-container_white',
  gray: 'decorator-utils-container_gray',
  transparent: 'decorator-utils-container_transparent',
  '': '',
};

export function SimpleHeader({
  availableLanguages,
  breadcrumbs,
  utilsBackground,
  innlogget,
  texts,
}: {
  texts: Texts;
  innlogget: boolean;
  availableLanguages: AvailableLanguage[];
  breadcrumbs: Breadcrumb[];
  utilsBackground: UtilsBackground;
}) {
  return html`
    <div id="menu-background"></div>
    <header class="siteheader">
      <div class="hovedmeny-wrapper ${cls.contentContainer}">
        <div class="hovedmeny-content">
          <a href="https://www.nav.no/"
            ><img src="/public/ikoner/meny/nav-logo-black.svg" alt="NAV"
          /></a>
        </div>
        ${SimpleHeaderNavbarItems({
          innlogget,
          texts,
          name: '',
        })}
      </div>
    </header>
    <div
      class="decorator-utils-container ${utilsBackgroundClasses[
        utilsBackground
      ]}"
    >
      <!-- ${Breadcrumbs({ breadcrumbs })} -->
      ${LanguageSelector({ availableLanguages })}
    </div>
  `;
}
