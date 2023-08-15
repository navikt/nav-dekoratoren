import { MyPageMenu, html } from '@/utils';
import { IconButton } from './components/icon-button';
import { LoginIcon } from './icons/login';
import { VarslerIcon } from '@/views/icons/varsler';
import { ProfileIcon } from '@/views/icons/profile';
import { HeaderMenuLinks } from './header-menu-links';

export function LoggedInMenu({
  name,
  myPageMenu,
}: {
  name: string;
  myPageMenu: MyPageMenu;
}) {
  return html`
    <div id="logged-in-menu">
      ${IconButton({
        id: 'varser-button',
        Icon: VarslerIcon,
        text: 'Varser',
      })}
      ${IconButton({
        id: 'profile-button',
        Icon: ProfileIcon,
        text: name,
        onclick: () => {
          document.getElementById(`my-page-menu`)?.classList.toggle(`active`);
          document
            .getElementById(`menu-background`)
            ?.classList.toggle(`active`);
        },
      })}
      ${IconButton({
        id: 'logout-button',
        Icon: LoginIcon,
        text: 'Logg ut',
      })}
      <div id="my-page-menu">
        <div id="my-page-menu-content">
          <div class="mb-4">
            <h2 class="text-medium-semibold">Min side</h2>
            <a class="link" href="#">Til Min side</a>
          </div>
          ${HeaderMenuLinks({
            headerMenuLinks: myPageMenu,
            className: 'space-between',
            cols: '3',
          })}
        </div>
      </div>
    </div>
  `;
}
