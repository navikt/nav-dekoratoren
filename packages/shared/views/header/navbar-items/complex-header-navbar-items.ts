// Should probably have a better name. Here i'm reffering to the buttons on the right
import { IconButton } from '../../components/icon-button';
import { BurgerIcon } from '../../icons/burger';
import Search from '../../search';
import { LoginIcon } from 'decorator-shared/views/icons/login';
import { Node } from '../../../types';
import html from 'decorator-shared/html';
import { Texts } from 'decorator-shared/texts';
import { LoggedInMenu } from 'decorator-shared/views/logged-in-menu';

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
  myPageMenu: Node[];
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
