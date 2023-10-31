import cls from 'decorator-client/src/styles/logged-in-menu.module.css';
import html from 'decorator-shared/html';
import { Node, Texts } from 'decorator-shared/types';
import { CloseIcon } from 'decorator-shared/views/icons';
import { LogoutIcon } from 'decorator-shared/views/icons/logout';
import { NotificationsIcon } from 'decorator-shared/views/icons/notifications';
import { ProfileIcon } from 'decorator-shared/views/icons/profile';
import { LoadingNotifications } from 'decorator-shared/views/notifications/loading';
import { DropdownMenu } from '../../dropdown-menu';
import { IconButton } from '../../icon-button';
import { HeaderMenuLinks } from '../header-menu-links';

export type LoggedInMenuProps = {
  name: string;
  myPageMenu: Node[];
  texts: Texts;
};

export function LoggedInMenu({ name, myPageMenu, texts }: LoggedInMenuProps) {
  return html`
    <div class="${cls.loggedInMenu}">
      ${DropdownMenu({
        button: IconButton({
          Icon: html`<div class="${cls.notificationsIconWrapper}" slot="icon">
            ${NotificationsIcon({ className: cls.notificationsIcon })}
            ${CloseIcon({ className: cls.closeIcon })}
            <div class="${cls.notificationsUnread}"></div>
          </div>`,
          text: texts.notifications,
        }),
        dropdownClass: cls.notificationsDropdown,
        dropdownContent: LoadingNotifications({
          texts,
        }),
      })}
      ${DropdownMenu({
        button: IconButton({
          Icon: ProfileIcon({}),
          text: name,
          chevron: true,
          className: cls.myPageMenuButton,
        }),
        dropdownClass: cls.myPageMenuDropdown,
        dropdownContent: html`<div>
            <h2 class="${cls.myPageMenuHeading}">Min side</h2>
            <a class="${cls.link}" href="#">Til Min side</a>
          </div>
          ${HeaderMenuLinks({
            headerMenuLinks: myPageMenu,
          })}`,
      })}
      ${IconButton({
        id: 'logout-button',
        Icon: LogoutIcon({}),
        text: texts.logout,
        className: cls.logoutButton,
      })}
    </div>
  `;
}
