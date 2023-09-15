import html from 'decorator-shared/html';
import { Breadcrumbs } from 'decorator-shared/views/breadcrumbs';
import {
  HeaderMenuLinkCols,
  HeaderMenuLinks,
} from 'decorator-shared/views/header-menu-links';
import LanguageSelector from 'decorator-shared/views/language-selector';
import { BackChevron } from 'decorator-shared/views/icons/back-chevron';
import { HeaderProps, utilsBackgroundClasses } from './index.js';
import { ComplexHeaderNavbarItems } from './navbar-items/complex-header-navbar-items.js';

export function ComplexHeader({
  isNorwegian,
  mainMenu,
  headerMenuLinks,
  texts,
  innlogget,
  breadcrumbs,
  utilsBackground,
  availableLanguages,
  myPageMenu,
}: HeaderProps) {
  return html`
    <div id="header-withmenu">
      <div
        id="menu-background"
      ></div>
      <header
        class="siteheader"
      >
        <div
          class="hovedmeny-wrapper"
        >
          <div class="hovedmeny-content">
            <img src="/ikoner/meny/nav-logo-red.svg" alt="NAV" />
            <div
              id="arbeidsflate"
            >
              ${
                isNorwegian &&
                mainMenu.map(
                  ({ displayName, isActive }) => html`
                    <button
                      class="context-link ${isActive ? 'lenkeActive' : ''}"
                      href="?context=${displayName.toLowerCase()}"
                      data-context="${displayName.toLowerCase()}"
                    >
                      ${displayName}
                    </button>
                  `,
                )
              }
            </div>
          </div>
          ${ComplexHeaderNavbarItems({
            innlogget,
            texts,
            myPageMenu,
          })}
        <div
          id="menu"
        >
         <div class="menu-top">
            <h2>
              Hva kan vi hjelpe deg med?
            </h2>
            <a
              class="link"
              href="#"
              >Til forsiden</a
            >
          </div>
            <div id="sub-menu-content">
            <div id="mobil-lukk">
            ${BackChevron()}
            <span>Tilbake til oversikt</span>
            </div>
            <ul></ul>
            </div>
            <div id="menu-content">
            <div id="inline-search">
                <inline-search></inline-search>
            </div>
            <decorator-loader id="search-loader"></decorator-loader>
            <div id="header-menu-links">
            ${HeaderMenuLinks({
              headerMenuLinks,
              cols: headerMenuLinks.length as HeaderMenuLinkCols,
            })}
            </div>
          </div>
        </div>
      </header>
      <div class="decorator-utils-container ${
        utilsBackgroundClasses[utilsBackground]
      }">
        ${Breadcrumbs({ breadcrumbs })}
        ${LanguageSelector({ availableLanguages })}
      </div>
    </div>
  `;
}
