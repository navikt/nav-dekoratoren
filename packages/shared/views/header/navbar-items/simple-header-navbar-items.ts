import { IconButton } from '../../components/icon-button';
import { LoginIcon } from 'decorator-shared/views/icons/login';
import html from 'decorator-shared/html';
import { Texts } from '../../../types';
import { LogoutIcon } from '../../icons/logout';
import cls from './menu-items.module.css';

export type SimpleHeaderNavbarItemsProps = {
  innlogget: boolean;
  name?: string;
  texts: Texts;
};

export const SimpleHeaderNavbarItems = (
  props: SimpleHeaderNavbarItemsProps,
) => html`
  <div class="${cls.menuItems}">
    ${props.innlogget
      ? html`
          <p><b>${props.texts.logged_in}:</b> ${props.name}</p>
          ${IconButton({
            id: 'logout-button',
            Icon: LogoutIcon,
            text: props.texts.logout,
          })}
        `
      : IconButton({
          id: 'login-button',
          Icon: LoginIcon,
          text: props.texts.login,
        })}
  </div>
`;
