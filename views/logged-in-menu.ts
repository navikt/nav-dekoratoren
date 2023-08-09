import { MyPageMenu, html } from '@/utils';
import { IconButton } from './components/icon-button';
import { LoginIcon } from './icons/login';
import { VarslerIcon } from '@/varsler';
import { ProfileIcon } from '@/profile';
import { HeaderMenuLinks } from './header-menu-links';

export function LoggedInMenu({
  name,
  myPageMenu,
}: {
  name: string;
  myPageMenu: MyPageMenu;
}) {
  return html`
    <div class="bg-surface-action-subtle h-full order-1 flex items-center px-2">
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
          document.getElementById(`my-page-menu`)?.classList.toggle(`hidden`);
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
      <div id="my-page-menu" class="absolute top-[80px] right-0 w-full hidden">
        <div
          class="w-full max-w-[1024px] mx-auto bg-white rounded-b-medium p-8"
        >
          <div class="mb-4">
            <h2 class="text-heading-medium font-semibold">Min side</h2>
            <a
              class="text-text-action underline pt-2 pb-3 inline-block"
              href="#"
              >Til Min side</a
            >
          </div>
          ${HeaderMenuLinks({
            headerMenuLinks: myPageMenu,
            className: 'space-between grid-cols-3',
          })}
        </div>
      </div>
    </div>
  `;
}
