import { Node, Texts } from '../../../types';
import html from 'decorator-shared/html';
import { IconButton } from '../../components/icon-button';
import { NotificationsIcon } from 'decorator-shared/views/icons/notifications';
import { ProfileIcon } from 'decorator-shared/views/icons/profile';
import { HeaderMenuLinks } from '../header-menu-links';
import { LoadingNotifications } from '../../notifications/loading';
import cls from './logged-in-menu.module.css';
import { LogoutIcon } from '../../icons/logout';

export type LoggedInMenuProps = {
  name: string;
  myPageMenu: Node[];
  texts: Texts;
};

export function LoggedInMenu({ name, myPageMenu, texts }: LoggedInMenuProps) {
  return html`
    <div class="${cls.loggedInMenu}">
      <div>
        <toggle-icon-button id="notifications-button">
          <div class="${cls.notificationsIconWrapper}" slot="icon">
            ${NotificationsIcon({ className: 'notifications-icon' })}
            <div class="${cls.notificationsUnread}"></div>
          </div>
          <span slot="text">${texts.notifications}</span>
        </toggle-icon-button>
      </div>
      ${IconButton({
        id: 'profile-button',
        Icon: ProfileIcon({}),
        text: name,
        chevron: true,
      })}
      ${IconButton({
        id: 'logout-button',
        Icon: LogoutIcon({}),
        text: texts.logout,
      })}
      <div id="loggedin-menu-wrapper" class="${cls.loggedinMenuWrapper}">
        <div class="${cls.loggedinMenuContent}">
          <div
            id="notifications-menu-content"
            class="${cls.dropdown} ${cls.notificationsMenuContent}"
          >
            ${LoadingNotifications({
              texts,
            })}
          </div>
          <div
            id="my-page-menu-content"
            class="${cls.dropdown} ${cls.myPageMenuContent}"
          >
            <div>
              <h2 class="${cls.myPageMenuHeading}">Min side</h2>
              <a class="${cls.link}" href="#">Til Min side</a>
            </div>
            ${HeaderMenuLinks({
              headerMenuLinks: myPageMenu,
            })}
          </div>
        </div>
      </div>
    </div>
  `;
}
