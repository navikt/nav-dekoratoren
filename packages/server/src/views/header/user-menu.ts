import globalCls from "decorator-client/src/styles/global.module.css";
import cls from "decorator-client/src/styles/user-menu.module.css";
import html from "decorator-shared/html";
import { LoginLevel } from "decorator-shared/params";
import {
    BadgeIcon,
    PadlockIcon,
    PersonCircleIcon,
} from "decorator-shared/views/icons";
import { LogoutIcon } from "decorator-shared/views/icons/logout";
import i18n from "../../i18n";
import { Notification } from "../../notifications";
import { Alert } from "../alert";
import { Notifications } from "../notifications/notifications";

export type UserMenuProps = {
    name: string;
    notifications: Notification[] | null;
    level: LoginLevel;
    loginUrl: string;
    logoutUrl: string;
    minsideUrl: string;
    personopplysningerUrl: string;
};

export const UserMenu = ({
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
                <div>
                    <div class="${cls.loggedIn}">${i18n("logged_in")}</div>
                    <div class="${cls.nameTest}">${name} McNameson</div>
                </div>
                ${level !== "Level4" &&
                Alert({
                    variant: "info",
                    content: html`
                        <div>${i18n("security_level_info")}</div>
                        <a
                            class="${globalCls["navds-link"]} ${globalCls[
                                "navds-link--neutral"
                            ]}"
                            href="${loginUrl}"
                        >
                            ${i18n("security_level_link")}
                        </a>
                    `,
                })}
            </div>
            <a href="${minsideUrl}" class="${cls.menuItem}">
                ${PersonCircleIcon({ className: cls.menuItemIcon })}
                <span>${i18n("my_page")}</span>
            </a>
            <a href="${personopplysningerUrl}" class="${cls.menuItem}">
                ${level === "Level4"
                    ? BadgeIcon({ className: cls.menuItemIcon })
                    : PadlockIcon({ className: cls.menuItemIcon })}
                <span>${i18n("personopplysninger")}</span>
            </a>
        </div>
        <div class="${cls.notifications}">
            ${Notifications({ notifications, minsideUrl })}
        </div>
        <a href="${logoutUrl}" class="${cls.menuItem} ${cls.logout}">
            ${LogoutIcon({})}
            <span>${i18n("logout")}</span>
        </a>
    </div>
`;
