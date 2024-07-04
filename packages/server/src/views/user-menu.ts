import clsx from "clsx";
import akselCls from "decorator-client/src/styles/aksel.module.css";
import globalCls from "decorator-client/src/styles/global.module.css";
import cls from "decorator-client/src/styles/user-menu.module.css";
import html from "decorator-shared/html";
import { LoginIcon } from "decorator-shared/views/icons";
import i18n from "../i18n";
import { HeaderButton } from "./header-button";

export const UserMenu = ({ loginUrl }: { loginUrl: string }) => html`
    <user-menu>
        <span class="${clsx(cls.loader, akselCls["navds-label"])}">
            ${i18n("loading")}
        </span>
        <login-button class="${globalCls.hidden}">
            ${HeaderButton({
                content: i18n("login"),
                icon: LoginIcon({}),
                href: loginUrl,
            })}
        </login-button>
    </user-menu>
`;
