import cls from 'decorator-client/src/styles/simple-user-menu.module.css';
import html from 'decorator-shared/html';
import { Texts } from 'decorator-shared/types';
import { LogoutIcon } from 'decorator-shared/views/icons/logout';
import { AnchorIconButton } from './icon-button';

export type SimpleUserMenuProps = {
    name: string;
    texts: Texts;
    logoutUrl: string;
};

export const SimpleUserMenu = ({ name, texts, logoutUrl }: SimpleUserMenuProps) =>
    html`<div class="${cls.simpleUserMenu}">
        <span class="${cls.name}">
            <b>${texts.logged_in}:</b>
            <span>${name}</span>
        </span>
        ${AnchorIconButton({
            Icon: LogoutIcon({}),
            text: texts.logout,
            href: logoutUrl,
        })}
    </div>`;
