import clsx from "clsx";
import aksel from "decorator-client/src/styles/aksel.module.css";
import cls from "decorator-client/src/styles/user-menu.module.css";
import utils from "decorator-client/src/styles/utils.module.css";
import { EnterIcon } from "decorator-icons";
import html from "decorator-shared/html";
import { hydrateAttr } from "decorator-shared/hydration";
import { userMenuHook } from "decorator-shared/views/user-menu";
import i18n from "../i18n";
import { HeaderButton } from "./components/header-button";

export const UserMenu = ({ loginUrl }: { loginUrl: string }) => html`
    <user-menu>
        <span
            class="${clsx(cls.loader, aksel["aksel-label"])}"
            ${hydrateAttr(userMenuHook.loader)}
        >
            ${i18n("loading")}
        </span>
        <login-button class="${utils.hidden}" data-color="accent">
            ${HeaderButton({
                content: i18n("login"),
                icon: EnterIcon(),
                href: loginUrl,
            })}
        </login-button>
    </user-menu>
`;
