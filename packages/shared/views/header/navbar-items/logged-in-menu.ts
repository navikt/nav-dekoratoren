import { Node, Texts } from '../../../types';
import html from 'decorator-shared/html';
import { IconButton } from '../../components/icon-button';
import { NotificationsIcon } from 'decorator-shared/views/icons/notifications';
import { ProfileIcon } from 'decorator-shared/views/icons/profile';
import { HeaderMenuLinks } from '../header-menu-links';
import { LoadingNotifications } from '../../notifications/loading';
import cls from './logged-in-menu.module.css';
import { LogoutIcon } from '../../icons/logout';
import clsx from 'clsx';

export type LoggedInMenuProps = {
  name: string;
  myPageMenu: Node[];
  texts: Texts;
};

export function LoggedInMenu({ name, myPageMenu, texts }: LoggedInMenuProps) {
  return html`
    <div class="${cls.loggedInMenu}">
      <dropdown-menu>
        ${IconButton({
          Icon: html`<div class="${cls.notificationsIconWrapper}" slot="icon">
            ${NotificationsIcon({})}
            <div class="${cls.notificationsUnread}"></div>
          </div>`,
          text: texts.notifications,
          className: 'dropdown-menu-button',
        })}
        <div
          class="${clsx(cls.notificationsDropdown, 'dropdown-menu-content')}"
        >
          ${LoadingNotifications({
            texts,
          })}
        </div>
      </dropdown-menu>
      <dropdown-menu>
        ${IconButton({
          Icon: ProfileIcon({}),
          text: name,
          chevron: true,
          className: 'dropdown-menu-button',
        })}
        <div class="${clsx(cls.myPageMenuDropdown, 'dropdown-menu-content')}">
          <div>
            <h2 class="${cls.myPageMenuHeading}">Min side</h2>
            <a class="${cls.link}" href="#">Til Min side</a>
          </div>
          ${HeaderMenuLinks({
            headerMenuLinks: myPageMenu,
          })}
        </div>
      </dropdown-menu>
      ${IconButton({
        id: 'logout-button',
        Icon: LogoutIcon({}),
        text: texts.logout,
      })}
    </div>
  `;
}
