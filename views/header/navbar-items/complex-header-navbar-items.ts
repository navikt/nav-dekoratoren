// Should probably have a better name. Here i'm reffering to the buttons on the right
import { IconButton } from '@/views/components/icon-button';
import { BurgerIcon } from '@/views/icons/burger';
import Search from '@/views/search';
import { LoginIcon } from '@/views/icons/login';
import { MyPageMenu, html } from '@/utils';
import { Texts } from '@/texts';
import { LoggedInMenu } from '@/views/logged-in-menu';

// Header menu items
export function ComplexHeaderNavbarItems({
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
        <button id="menu-button" class="icon-button">
          ${BurgerIcon({
            className: 'menuBurger',
          })}
          <span class="icon-button-span"> ${texts.menu} </span>
        </button>
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
