import { Node, Texts } from '../../../types';
import html from 'decorator-shared/html';
import { IconButton } from '../../components/icon-button';
import { LoginIcon } from '../../icons/login';
import { NotificationsIcon } from 'decorator-shared/views/icons/notifications';
import { ProfileIcon } from 'decorator-shared/views/icons/profile';
import { HeaderMenuLinks } from '../header-menu-links';
import { DropdownButton } from '../../components/dropdown-button';
import { LoadingNotifications } from '../../notifications/loading';
import cls from './logged-in-menu.module.css';

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
          <div class="notifications-icon-wrapper" slot="icon">
            ${NotificationsIcon({ className: 'notifications-icon' })}
            <div class="notifications-unread"></div>
          </div>
          <span slot="text">${texts.notifications}</span>
        </toggle-icon-button>
      </div>
      ${DropdownButton({
        id: 'profile-button',
        icon: ProfileIcon({
          className: '',
        }),
        text: name,
      })}
      ${IconButton({
        id: 'logout-button',
        Icon: LoginIcon,
        text: 'Logg ut',
      })}

      <div id="loggedin-menu-wrapper" class="${cls.loggedinMenuWrapper}">
        <div class="${cls.loggedinMenuContent}">
          <div
            id="notifications-menu-content"
            class="${cls.dropdown} ${cls.notificationsMenuContent}"
          >
            <!-- Placeholder for now -->
            ${LoadingNotifications({
              texts,
            })}
            <!-- Loaded on client -->
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

export type SimpleLoggedInMenuProps = { name: string };

export function SimpleLoggedInMenu({ name }: SimpleLoggedInMenuProps) {
  return html`
    <div class="${cls.simpleLoggedInMenu}">
      <p><b>Logget inn:</b> ${name}</p>
      ${IconButton({
        id: 'logout-button',
        Icon: LoginIcon,
        text: 'Logg ut',
      })}
    </div>
  `;
}
