import html from 'decorator-shared/html';
import { IconButton } from './icon-button';
import { LoginIcon } from 'decorator-shared/views/icons';
import { WithTexts } from 'decorator-shared/types';

export function LoginButton(params: WithTexts) {
    return html`
        <login-button>
            ${IconButton({
                id: 'login-button',
                Icon: LoginIcon({}),
                text: params.texts.login,
            })}
        </login-button>
    `;
}
