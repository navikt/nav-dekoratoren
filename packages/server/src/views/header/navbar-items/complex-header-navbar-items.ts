import cls from 'decorator-client/src/styles/menu-items.module.css';
import html from 'decorator-shared/html';
import {
  LinkGroup,
  MainMenuContextLink,
  Node,
  Texts,
} from 'decorator-shared/types';
import { SearchIcon } from 'decorator-shared/views/icons';
import { BurgerIcon } from 'decorator-shared/views/icons/burger';
import { LoginIcon } from 'decorator-shared/views/icons/login';
import { DropdownMenu } from '../../dropdown-menu';
import { IconButton } from '../../icon-button';
import { SearchForm } from '../../search-form';
import { ComplexHeaderMenu } from '../complex-header-menu';
import { LoggedInMenu } from './logged-in-menu';

export type ComplexHeaderNavbarItemsProps = {
  mainMenuTitle: string;
  frontPageUrl: string;
  innlogget: boolean;
  name?: string;
  texts: Texts;
  myPageMenu?: Node[];
  mainMenuLinks: LinkGroup[];
  contextLinks: MainMenuContextLink[];
};

export function ComplexHeaderNavbarItems({
  mainMenuTitle,
  frontPageUrl,
  innlogget,
  name,
  texts,
  myPageMenu,
  mainMenuLinks,
  contextLinks,
}: ComplexHeaderNavbarItemsProps) {
  return html`
    <div class="${cls.menuItems}">
      <user-menu>
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
      </user-menu>
      <div class="${cls.menuItemsUniversalLinks}">
        ${DropdownMenu({
          button: IconButton({
            Icon: BurgerIcon(),
            text: texts.menu,
          }),
          dropdownContent: ComplexHeaderMenu({
            mainMenuTitle,
            frontPageUrl,
            mainMenuLinks,
            contextLinks,
            texts,
          }),
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
    </div>
  `;
}
