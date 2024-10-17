import aksel from "decorator-client/src/styles/aksel.module.css";
import cls from "decorator-client/src/styles/user-menu.module.css";
import utils from "decorator-client/src/styles/utils.module.css";
import {
    BagdeIcon,
    LeaveIcon,
    PadlockLockedIcon,
    PersonCircleIcon,
} from "decorator-icons";
import html from "decorator-shared/html";
import { LoginLevel } from "decorator-shared/params";
import i18n from "../../i18n";
import { Notification } from "../../notifications";
import { Alert } from "../components/alert";
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
                    <div class="${cls.name}">${name}</div>
                </div>
                ${level !== "Level4" &&
                Alert({
                    variant: "info",
                    content: html`
                        <div>${i18n("security_level_info")}</div>
                        <a
                            class="${aksel["navds-link"]} ${aksel[
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
                ${PersonCircleIcon({ className: utils.icon })}
                <span>${i18n("my_page")}</span>
            </a>
            <a href="${personopplysningerUrl}" class="${cls.menuItem}">
                ${level === "Level4"
                    ? BagdeIcon({ className: utils.icon })
                    : PadlockLockedIcon({ className: utils.icon })}
                <span>${i18n("personopplysninger")}</span>
            </a>
        </div>
        <div class="${cls.notifications}">
            ${Notifications({ notifications, minsideUrl })}
        </div>
        <a href="${logoutUrl}" class="${cls.menuItem} ${cls.logout}">
            ${LeaveIcon({ className: utils.icon })}
            <span>${i18n("logout")}</span>
        </a>
    </div>
`;
