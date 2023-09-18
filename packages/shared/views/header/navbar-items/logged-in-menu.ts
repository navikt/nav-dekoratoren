import { Node } from '../../../types';
import html from 'decorator-shared/html';
import { IconButton } from '../../components/icon-button';
import { LoginIcon } from '../../icons/login';
import { VarslerIcon } from 'decorator-shared/views/icons/varsler';
import { ProfileIcon } from 'decorator-shared/views/icons/profile';
import { HeaderMenuLinks } from '../header-menu-links';
import { VarslerEmptyView, VarslerUlest } from '../../varsler';
import { texts } from 'decorator-shared/texts';

// ${IconButton({
//   id: 'varsler-button',
//   Icon: () => html`
//     <div class="varsler-icon-wrapper">
//       ${VarslerIcon({ className: 'varsler-icon' })} ${VarslerUlest()}
//     </div>
//   `,
//   text: 'Varsler',
// })}
export function LoggedInMenu({
  name,
  myPageMenu,
}: {
  name: string;
  myPageMenu: Node[];
}) {
  return html`
    <div id="logged-in-menu">
      <div class="varsler-button-wrapper">
        <toggle-icon-button id="varsler-button">
          <div class="varsler-icon-wrapper" slot="icon">
            ${VarslerIcon({ className: 'varsler-icon' })} ${VarslerUlest()}
          </div>
          <span slot="text">Varsler</span>
        </toggle-icon-button>
      </div>
      ${IconButton({
        id: 'profile-button',
        Icon: ProfileIcon,
        text: name,
      })}
      ${IconButton({
        id: 'logout-button',
        Icon: LoginIcon,
        text: 'Logg ut',
      })}
      <div id="loggedin-menu-wrapper">
        <div id="loggedin-menu-content">
          <div id="varsler-menu-content" class="dropdown">
            <!-- Placeholder for now -->
            ${VarslerEmptyView({
              texts: texts['no'],
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
              className: 'space-between',
              cols: 3,
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
