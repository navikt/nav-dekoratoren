import clsx from "clsx";
import globalCls from "decorator-client/src/styles/global.module.css";
import cls from "decorator-client/src/styles/user-menu.module.css";
import html from "decorator-shared/html";
import { LoginLevel } from "decorator-shared/params";
import { Texts } from "decorator-shared/types";
import { Alert } from "decorator-shared/views/alert";
import {
    BadgeIcon,
    PadlockIcon,
    PersonCircleIcon,
} from "decorator-shared/views/icons";
import { LogoutIcon } from "decorator-shared/views/icons/logout";
import { Notification } from "../../notifications";
import { Notifications } from "../notifications/notifications";

export type UserMenuProps = {
    texts: Texts;
    name: string;
    notifications: Notification[] | null;
    level: LoginLevel;
    loginUrl: string;
    logoutUrl: string;
    minsideUrl: string;
    personopplysningerUrl: string;
};

export const UserMenu = ({
    texts,
    name,
    level,
    notifications,
    loginUrl,
    logoutUrl,
    minsideUrl,
    personopplysningerUrl,
}: UserMenuProps) => html`
    <div class="${cls.userMenu}">
        <div class="${cls.menuItems}">
            <div class="${cls.menuHeader}">
                <div class="${cls.loggedIn}">${texts.logged_in}</div>
                <div class="${cls.name}">${name}</div>
                ${level !== "Level4" &&
                Alert({
                    className: cls.alert,
                    variant: "info",
                    content: html`
                        <div>
                            ${texts.security_level_info}
                            <a
                                class="${clsx(
                                    globalCls.link,
                                    globalCls.linkNeutral,
                                )}"
                                href="${loginUrl}"
                                >Logg inn med BankID, Buypass, eller
                                Commfides</a
                            >
                        </div>
                    `,
                })}
            </div>
            <a href="${minsideUrl}" class="${cls.menuItem}">
                ${PersonCircleIcon({ className: cls.menuItemIcon })}
                <span>Min side</span>
            </a>
            <a href="${personopplysningerUrl}" class="${cls.menuItem}">
                ${level === "Level4"
                    ? BadgeIcon({ className: cls.menuItemIcon })
                    : PadlockIcon({ className: cls.menuItemIcon })}
                <span>Personopplysninger</span>
            </a>
        </div>
        <div class="${cls.notifications}">
            ${Notifications({ texts, notifications })}
        </div>
        <a href="${logoutUrl}" class="${cls.menuItem} ${cls.logout}">
            ${LogoutIcon({})}
            <span>Logg ut</span>
        </a>
    </div>
`;
