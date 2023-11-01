import cls from 'decorator-client/src/styles/menu-items.module.css';
import html from 'decorator-shared/html';
import { Texts } from 'decorator-shared/types';
import { LoginIcon } from 'decorator-shared/views/icons/login';
import { LogoutIcon } from 'decorator-shared/views/icons/logout';
import { IconButton } from '../../icon-button';

export type SimpleHeaderNavbarItemsProps = {
  innlogget: boolean;
  name?: string;
  texts: Texts;
};

export const SimpleHeaderNavbarItems = (
  props: SimpleHeaderNavbarItemsProps,
) => html`
  <user-menu class="${cls.menuItems}">
    ${props.innlogget
      ? html`
          <p><b>${props.texts.logged_in}:</b> ${props.name}</p>
          ${IconButton({
            id: 'logout-button',
            Icon: LogoutIcon({}),
            text: props.texts.logout,
          })}
        `
      : IconButton({
          id: 'login-button',
          Icon: LoginIcon({
            className: '',
          }),
          text: props.texts.login,
        })}
  </user-menu>
`;
