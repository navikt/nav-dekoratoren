// Should probably have a better name. Here i'm reffering to the buttons on the right
import { IconButton } from './components/icon-button';
import { BurgerIcon } from './icons/burger';
import Search from './search';
import { LoginIcon } from './icons/login';
import { MyPageMenu, html } from '@/utils';
import { Texts } from '@/texts';
import { LoggedInMenu } from './logged-in-menu';

// Header menu items
export function HeaderNavbarItems({
  innlogget,
  name,
  texts,
  myPageMenu,
}: {
  innlogget: boolean;
  name?: string;
  texts: Texts;
  myPageMenu: MyPageMenu;
}) {
  // @TODO: More granular rendering to avoid reattaching event listeners
  return html`
    <div id="menu-items" class="${innlogget && 'loggedin'}">
      <div id="menu-items-universal-links">
        <toggle-icon-button id="menu-button">
          ${BurgerIcon({
            slot: 'icon',
          })}
          <span slot="idleText">Meny</span>
          <span slot="openedText">Lukk</span>
        </toggle-icon-button>
        ${Search({ texts })}
      </div>
      ${innlogget
        ? LoggedInMenu({ name: name as string, myPageMenu })
        : html`
            ${IconButton({
              id: 'login-button',
              Icon: LoginIcon,
              text: texts.login,
            })}
          `}
    </div>
  `;
}
// class="group-[.loggedin]:order-2 flex"
