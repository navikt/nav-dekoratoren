import { Node, Texts } from '../../../types';
import html from 'decorator-shared/html';
import { IconButton } from '../../components/icon-button';
import { LoginIcon } from '../../icons/login';
import { NotificationsIcon } from 'decorator-shared/views/icons/notifications';
import { ProfileIcon } from 'decorator-shared/views/icons/profile';
import { HeaderMenuLinks } from '../header-menu-links';
import { DropdownButton } from '../../components/dropdown-button';
import { LoadingNotifications } from '../../notifications/loading';

// ${IconButton({
//   id: 'profile-button',
//   Icon: ProfileIcon,
//   text: name,
// })}
export function LoggedInMenu({
  name,
  myPageMenu,
  texts,
}: {
  name: string;
  myPageMenu: Node[];
  texts: Texts;
}) {
  return html`
    <div id="logged-in-menu">
      <div class="notifications-button-wrapper">
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

      <div id="loggedin-menu-wrapper">
        <div id="loggedin-menu-content">
          <div id="notifications-menu-content" class="dropdown">
            <!-- Placeholder for now -->
            ${LoadingNotifications({
              texts,
            })}
            <!-- Loaded on client -->
          </div>
          <div id="my-page-menu-content" class="dropdown">
            <div class="mb-4">
              <h2 class="text-medium-semibold">Min side</h2>
              <a class="link" href="#">Til Min side</a>
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

export function SimpleLoggedInMenu({ name }: { name: string }) {
  return html`
    <div id="simple-logged-in-menu">
      <p><b>Logget inn:</b> ${name}</p>
      ${IconButton({
        id: 'logout-button',
        Icon: LoginIcon,
        text: 'Logg ut',
      })}
    </div>
  `;
}
