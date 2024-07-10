import clsx from "clsx";
import akselCls from "decorator-client/src/styles/aksel.module.css";
import globalCls from "decorator-client/src/styles/global.module.css";
import cls from "decorator-client/src/styles/user-menu.module.css";
import html from "decorator-shared/html";
import { EnterIcon } from "decorator-icons";
import i18n from "../i18n";
import { HeaderButton } from "./components/header-button";

export const UserMenu = ({ loginUrl }: { loginUrl: string }) => html`
    <user-menu>
        <span class="${clsx(cls.loader, akselCls["navds-label"])}">
            ${i18n("loading")}
        </span>
        <login-button class="${globalCls.hidden}">
            ${HeaderButton({
                content: i18n("login"),
                icon: EnterIcon(),
                href: loginUrl,
            })}
        </login-button>
    </user-menu>
`;
