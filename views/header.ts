import { Breadcrumb, UtilsBackground } from "../params";
import { HeaderMenuLinksData, MainMenu, html } from "@/utils";
import { Texts } from "../texts";
import { Breadcrumbs } from "./breadcrumbs";
import { HeaderMenuLinks } from "./header-menu-links";

export type HeaderProps = Parameters<typeof Header>[0];

export function Header({
  isNorwegian,
  mainMenu,
  headerMenuLinks,
  texts,
  innlogget,
  breadcrumbs,
  utilsBackground,
}: {
  isNorwegian: boolean;
  mainMenu: MainMenu;
  texts: Texts;
  headerMenuLinks: HeaderMenuLinksData;
  innlogget: boolean;
  breadcrumbs: Breadcrumb[];
  utilsBackground: UtilsBackground;
}) {
  return html`
    <div id="header-withmenu">
      <div
        id="menu-background"
        class="fixed top-0 left-0 right-0 bottom-0 bg-modal-background z-10 opacity-0 pointer-events-none transition duration-[350ms] transition-ease-in"
      ></div>
      <header
        id="hovedmeny"
        class="relative header h-[80px] bg-white border-gray-300 border-b z-20"
      >
        <div
          class="max-w-[1344px] w-full mx-auto flex justify-between items-center h-full"
        >
          <div class="flex items-center h-full w-full">
            <img src="/ikoner/meny/nav-logo-red.svg" alt="NAV" />
            <!-- Context links -->
            <div
              id="arbeidsflate"
              class="flex h-full items-center gap-4 ml-[40px]"
            >
              ${
                isNorwegian &&
                mainMenu.map(
                  ({ displayName, styles }) => html`
                    <button
                      class="context-link h-full flex items-center border-b-4 ${styles}"
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
          ${
            innlogget
              ? html` Du er innlogget `
              : html`
                  <div class="flex items-center">
                    <button
                      id="menu-button"
                      class="group flex gap-2 text-blue-500 rounded-[3px] py-3 px-2 pr-4 pl-1 border-2 border-transparent hover:border-blue-500 hover:bg-blue-100 active:bg-surface-action-active active:text-white ring-[3px] ring-transparent active:ring-blue-800 active:border active:border-white"
                    >
                      <img
                        class="group-active:hidden group-[.active]:hidden block"
                        src="/ikoner/meny/burger.svg"
                        alt="Meny"
                      />
                      <img
                        class="group-active:block group-[.active]:hidden hidden"
                        src="/ikoner/meny/burger-white.svg"
                        alt="Meny"
                      />
                      <span class="font-bold group-[.active]:hidden"
                        >${texts.menu}</span
                      >
                      <img
                        class="group-[.active]:group-active:hidden group-[.active]:block hidden"
                        src="/ikoner/meny/menu-close.svg"
                        alt="Meny"
                      />
                      <img
                        class="group-[.active]:group-active:block hidden"
                        src="/ikoner/meny/menu-close-white.svg"
                        alt="Meny"
                      />
                      <span class="font-bold group-[.active]:block hidden"
                        >${texts.close}</span
                      >
                    </button>
                  </div>
                `
          }
        <div
          id="menu"
          class="absolute top-[80px] mx-auto left-1/2 transform -translate-x-1/2 w-full bg-white max-w-[1440px] rounded-b-small hidden  px-8 py-8"
        >
          <div class="mb-4">
            <h2 class="text-heading-medium font-semibold">
              Hva kan vi hjelpe deg med?
            </h2>
            <a
              class="text-text-action underline pt-2 pb-3 inline-block"
              href="#"
              >Til forsiden</a
            >
          </div>
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
      ${Breadcrumbs({
        breadcrumbs,
        utilsBackground,
      })}
    </div>
  `;
}
// <!-- {{> breadcrumbs}} -->
// <!-- ${Breadcrumbs} -->
// <!-- {{> breadcrumbs}} -->
