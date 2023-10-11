import { IconButton } from '../../components/icon-button';
import { BurgerIcon } from '../../icons/burger';
import Search from '../../search';
import { LoginIcon } from 'decorator-shared/views/icons/login';
import { Node } from '../../../types';
import html from 'decorator-shared/html';
import { Texts } from 'decorator-shared/types';
import { LoggedInMenu } from './logged-in-menu';
import cls from './menu-items.module.css';

export type ComplexHeaderNavbarItemsProps = {
  innlogget: boolean;
  name?: string;
  texts: Texts;
  myPageMenu: Node[];
};

export function ComplexHeaderNavbarItems({
  innlogget,
  name,
  texts,
  myPageMenu,
}: ComplexHeaderNavbarItemsProps) {
  return html`
    <div class="${cls.menuItems}">
      <div class="${cls.menuItemsUniversalLinks}">
        ${IconButton({
          id: 'menu-button',
          Icon: BurgerIcon(),
          text: texts.menu,
        })}
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
            Icon: LoginIcon({}),
            text: texts.login,
          })}
    </div>
  `;
}
