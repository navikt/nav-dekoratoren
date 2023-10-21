import { IconButton } from '../../components/icon-button';
import { BurgerIcon } from '../../icons/burger';
import { LoginIcon } from 'decorator-shared/views/icons/login';
import { Node } from '../../../types';
import html from 'decorator-shared/html';
import { Texts } from 'decorator-shared/types';
import { LoggedInMenu } from './logged-in-menu';
import cls from './menu-items.module.css';
import { ComplexHeaderMenu } from 'decorator-server/src/views/header/complex-header-menu';
import { DropdownMenu } from '../../dropdown-menu';
import { SearchIcon } from '../../icons';
import { SearchForm } from '../../search-form';

export type ComplexHeaderNavbarItemsProps = {
  innlogget: boolean;
  name?: string;
  texts: Texts;
  myPageMenu: Node[];
  headerMenuLinks?: Node[];
};

export function ComplexHeaderNavbarItems({
  innlogget,
  name,
  texts,
  myPageMenu,
  headerMenuLinks,
}: ComplexHeaderNavbarItemsProps) {
  return html`
    <div class="${cls.menuItems}">
      <div class="${cls.menuItemsUniversalLinks}">
        ${DropdownMenu({
          button: IconButton({
            id: 'menu-button',
            Icon: BurgerIcon(),
            text: texts.menu,
          }),
          dropdownContent: ComplexHeaderMenu({ headerMenuLinks, texts }),
        })}
        ${DropdownMenu({
          button: IconButton({
            Icon: SearchIcon({
              menuSearch: true,
            }),
            text: texts.search,
            className: cls.searchButton,
          }),
          dropdownClass: cls.searchDropdown,
          dropdownContent: html`
            <search-menu class="${cls.searchMenu}" data-auto-focus>
              ${SearchForm({ texts })}
            </search-menu>
          `,
        })}
      </div>
      ${innlogget
        ? LoggedInMenu({
            name: name as string,
            myPageMenu,
            texts,
          })
        : IconButton({
            id: 'login-button',
            Icon: LoginIcon({
              className: '',
            }),
            text: texts.login,
          })}
    </div>
  `;
}
