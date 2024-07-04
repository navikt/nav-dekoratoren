import clsx from "clsx";
import akselCls from "decorator-client/src/styles/aksel.module.css";
import menuItemsCls from "decorator-client/src/styles/menu-items.module.css";
import cls from "decorator-client/src/styles/user-menu.module.css";
import html from "decorator-shared/html";
import { LoginIcon } from "decorator-shared/views/icons";
import i18n from "../i18n";
import { Button } from "./button";

export const UserMenu = ({ loginUrl }: { loginUrl: string }) => html`
    <user-menu>
        <span class="${clsx(cls.loader, akselCls["navds-label"])}">
            ${i18n("loading")}
        </span>
        <login-button class="${cls.hidden}">
            ${Button({
                content: i18n("login"),
                icon: LoginIcon({}),
                variant: "tertiary",
                className: menuItemsCls.menuItem,
                href: loginUrl,
            })}
        </login-button>
    </user-menu>
`;
