import type { AvailableLanguage, Breadcrumb, UtilsBackground } from '../params';
import { HeaderMenuLinksData, MainMenu, MyPageMenu, html } from '../utils';
import { Texts } from '../texts';
import { Breadcrumbs } from './breadcrumbs';
import { HeaderMenuLinks } from './header-menu-links';
import LanguageSelector from './language-selector';
import { HeaderNavbarItems } from './header-navbar-items';
import { BackChevron } from './icons/back-chevron';

export type HeaderProps = Parameters<typeof Header>[0];

const utilsBackgroundClasses = {
  white: 'decorator-utils-container_white',
  gray: 'decorator-utils-container_gray',
  transparent: 'decorator-utils-container_transparent',
  '': '',
} as const;

export function Header({
  isNorwegian,
  mainMenu,
  headerMenuLinks,
  texts,
  innlogget,
  breadcrumbs,
  utilsBackground,
  availableLanguages,
  myPageMenu,
}: {
  isNorwegian: boolean;
  mainMenu: MainMenu;
  texts: Texts;
  headerMenuLinks: HeaderMenuLinksData;
  innlogget: boolean;
  breadcrumbs: Breadcrumb[];
  utilsBackground: UtilsBackground;
  availableLanguages: AvailableLanguage[];
  myPageMenu: MyPageMenu;
}) {
  return html`
    <div id="header-withmenu">
      <div
        id="menu-background"
      ></div>
      <header
        id="hovedmeny"
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
          ${HeaderNavbarItems({
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
