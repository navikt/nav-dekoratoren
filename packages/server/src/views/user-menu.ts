import clsx from "clsx";
import akselCls from "decorator-client/src/styles/aksel.module.css";
import menuItemsCls from "decorator-client/src/styles/menu-items.module.css";
import cls from "decorator-client/src/styles/user-menu.module.css";
import html from "decorator-shared/html";
import { LoginIcon } from "decorator-shared/views/icons";
import i18n from "../i18n";

// TODO: loginbutton styles. reuse Button?
export function UserMenu({ loginUrl }: { loginUrl: string }) {
    return html`<user-menu>
        <span class="${clsx(cls.loader, akselCls["navds-label"])}"
            >${i18n("loading")}</span
        >
        <login-button class="${cls.hidden}">
            <a
                href="${loginUrl}"
                class="${clsx(
                    akselCls["navds-button"],
                    akselCls["navds-button--tertiary"],
                    menuItemsCls.menuItem,
                )}"
            >
                <span class="${akselCls["navds-button__icon"]}">
                    ${LoginIcon({})}
                </span>
                <span class="${akselCls["navds-label"]}">${i18n("login")}</span>
            </a>
        </login-button>
    </user-menu>`;
}
