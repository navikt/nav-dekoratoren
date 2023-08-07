import { MyPageMenu, html } from '@/utils';
import { IconButton } from './components/icon-button';
import { LoginIcon } from './icons/login';
import { VarslerIcon } from '@/varsler';
import { ProfileIcon } from '@/profile';

export function LoggedInMenu({
  name,
  myPageMenu,
}: {
  name: string;
  myPageMenu: MyPageMenu;
}) {
  console.log(myPageMenu);
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
      })}
      ${IconButton({
        id: 'logout-button',
        Icon: LoginIcon,
        text: 'Logg ut',
      })}
      <div
        class="absolute top-[80px] w-full right-[700px] max-w-[1024px] h-40 bg-white rounded-b-medium"
      >
        <div class="w-full">
          ${myPageMenu.map((link) => html`${link.displayName}`)}
        </div>
      </div>
    </div>
  `;
}
