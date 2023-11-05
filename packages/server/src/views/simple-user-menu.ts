import cls from 'decorator-client/src/styles/simple-user-menu.module.css';
import html from 'decorator-shared/html';
import { Texts } from 'decorator-shared/types';
import { LogoutIcon } from 'decorator-shared/views/icons/logout';
import { IconButton } from './icon-button';

export type SimpleUserMenuProps = {
  name: string;
  texts: Texts;
};

export const SimpleUserMenu = ({ name, texts }: SimpleUserMenuProps) =>
  html`<div class="${cls.simpleUserMenu}">
    <span><b>${texts.logged_in}:</b> ${name}</span>
    ${IconButton({
      id: 'logout-button',
      Icon: LogoutIcon({}),
      text: texts.logout,
    })}
  </div>`;
