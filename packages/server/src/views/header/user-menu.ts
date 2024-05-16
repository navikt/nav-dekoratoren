import html from "decorator-shared/html";
import { Texts } from "decorator-shared/types";
import {
    PadlockIcon,
    BadgeIcon,
    PersonCircleIcon,
} from "decorator-shared/views/icons";
import { LogoutIcon } from "decorator-shared/views/icons/logout";
import cls from "decorator-client/src/styles/user-menu.module.css";
import { Notifications } from "../notifications/notifications";
import { LoginLevel } from "decorator-shared/params";
import { Alert } from "decorator-shared/views/alert";
import { Notification } from "../../notifications";
import { env } from "../../env/server";

export type UserMenuProps = {
    texts: Texts;
    name: string;
    notifications: Notification[] | null;
    level: LoginLevel;
    logoutUrl: string;
    minsideUrl: string;
    personopplysningerUrl: string;
};

export const UserMenu = ({
    texts,
    name,
    level,
    notifications,
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
                            <a class="${cls.link}" href="${env.LOGIN_URL}"
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
