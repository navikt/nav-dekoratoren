import { MyPageMenu, html } from '@/utils';
import { IconButton } from './components/icon-button';
import { LoginIcon } from './icons/login';
import { VarslerIcon } from '@/views/icons/varsler';
import { ProfileIcon } from '@/views/icons/profile';
import { HeaderMenuLinks } from './header-menu-links';
import { VarslerEmptyView, VarslerUlest } from './varsler';
import { texts } from '@/texts';
import { selectors } from './selectors';
// import { Texts } from '@/texts';

// Fetch varsler and such
export function initLoggedInMenu() {
  const profileButton = document.getElementById('profile-button');
  const dropdownIds = ['my-page-menu-content', 'varsler-menu-content'];

  // @TODO: needs some minor polishing to get switching between menus to work
  const toggleContainer = () => {
    document
      .getElementById(`loggedin-menu-wrapper`)
      ?.classList.toggle(`active`);
    document.getElementById(`menu-background`)?.classList.toggle(`active`);
  };

  const hideDropdowns = () => {
    dropdownIds.forEach((id) => {
      document.getElementById(id)?.classList.remove('active');
    });
  };

  profileButton?.addEventListener('click', () => {
    toggleContainer();
    hideDropdowns();

    document.getElementById('my-page-menu-content')?.classList.toggle('active');
  });

  const varslerButton = document.getElementById('varsler-button');

  varslerButton?.addEventListener('click', () => {
    toggleContainer();
    hideDropdowns();

    document.getElementById('varsler-menu-content')?.classList.toggle('active');
  });
}

export function LoggedInMenu({
  name,
  myPageMenu,
}: {
  name: string;
  myPageMenu: MyPageMenu;
}) {
  return html`
    <div id="logged-in-menu">
      <div class="varsler-button-wrapper">
        ${IconButton({
          id: 'varsler-button',
          Icon: () => html`
            <div class="varsler-icon-wrapper">
              ${VarslerIcon({ className: 'varsler-icon' })} ${VarslerUlest()}
            </div>
          `,
          text: 'Varsler',
        })}
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
          <div id="${selectors.ids.VARSLER_MENU_CONTENT}" class="dropdown">
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
