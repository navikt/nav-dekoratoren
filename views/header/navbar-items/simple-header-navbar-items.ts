// Should probably have a better name. Here i'm reffering to the buttons on the right
import { IconButton } from '@/views/components/icon-button';
import { LoginIcon } from '@/views/icons/login';
import { html } from '@/utils';
import { Texts } from '@/texts';
import { SimpleLoggedInMenu } from '@/views/logged-in-menu';

// Header menu items
export function SimpleHeaderNavbarItems({
  innlogget,
  name,
  texts,
}: {
  innlogget: boolean;
  name?: string;
  texts: Texts;
}) {
  // @TODO: More granular rendering to avoid reattaching event listeners
  return html`
    <div id="menu-items">
      ${innlogget
        ? SimpleLoggedInMenu({ name: name as string })
        : html`
            <div>
              ${IconButton({
                id: 'login-button',
                Icon: LoginIcon,
                text: texts.login,
              })}
            </div>
          `}
    </div>
  `;
}
// class="group-[.loggedin]:order-2 flex"
