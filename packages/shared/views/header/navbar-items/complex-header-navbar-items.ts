import { IconButton } from '../../components/icon-button';
import { BurgerIcon } from '../../icons/burger';
import Search from '../../search';
import { LoginIcon } from 'decorator-shared/views/icons/login';
import { Node } from '../../../types';
import html from 'decorator-shared/html';
import { Texts } from 'decorator-shared/types';
import { LoggedInMenu } from './logged-in-menu';
import cls from './menu-items.module.css';
import { ComplexHeaderMenu } from 'decorator-server/src/views/header/complex-header-menu';
import headerClasses from 'decorator-client/src/styles/header.module.css';
import clsx from 'clsx';
import utilsCls from 'decorator-shared/utilities.module.css';

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
        <dropdown-menu>
          ${IconButton({
            id: 'menu-button',
            Icon: BurgerIcon(),
            text: texts.menu,
            className: 'dropdown-menu-button',
          })}
          <div class="${clsx(headerClasses.menu, utilsCls.contentContainer)}">
            ${ComplexHeaderMenu({ headerMenuLinks, texts })}
          </div>
        </dropdown-menu>
        ${Search({ texts })}
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
