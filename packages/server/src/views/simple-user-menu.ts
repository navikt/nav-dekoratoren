import menuItemsCls from "decorator-client/src/styles/menu-items.module.css";
import cls from "decorator-client/src/styles/simple-user-menu.module.css";
import html from "decorator-shared/html";
import { LogoutIcon } from "decorator-shared/views/icons/logout";
import i18n from "../i18n";
import { Button } from "./button";

export type SimpleUserMenuProps = {
    name: string;
    logoutUrl: string;
};

export const SimpleUserMenu = ({ name, logoutUrl }: SimpleUserMenuProps) =>
    html`<div class="${cls.simpleUserMenu}">
        <span class="${cls.name}">
            <b>${i18n("logged_in")}:</b>
            <span>${name}</span>
        </span>
        ${Button({
            content: i18n("logout"),
            icon: LogoutIcon({}),
            className: menuItemsCls.menuItem,
            href: logoutUrl,
        })}
    </div>`;
