import { AvailableLanguage, Breadcrumb, UtilsBackground } from '../params';
import { HeaderMenuLinksData, MainMenu, MyPageMenu, html } from '../utils';
import { Texts } from '../texts';
import { Breadcrumbs } from './breadcrumbs';
import { HeaderMenuLinks } from './header-menu-links';
import LanguageSelector from './language-selector';
import { MenuItems } from './menu-items';

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
  // Should maybe just pass components as string
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
            <!-- Context links -->
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
          <!-- Menu button -->
          <!-- Show different buttons based on auth state -->
          ${MenuItems({
            innlogget,
            texts,
            myPageMenu,
          })}
        <div
          id="menu"
        >
            <h2>
              Hva kan vi hjelpe deg med?
            </h2>
            <a
              class="link"
              href="#"
              >Til forsiden</a
            >
          <div>
            <div id="header-menu-links">
            ${HeaderMenuLinks({
              headerMenuLinks,
            })}
            </div>
            <ul>
              <li>
                <a href="/minside">Min side</a>
              </li>
              <li>
                <a href="/no/bedrift">Arbeidsgiver</a>
              </li>
              <li>
                <a href="/no/samarbeidspartner">Samarbeidspartner</a>
              </li>
            </ul>
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
