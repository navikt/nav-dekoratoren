import cls from "decorator-client/src/styles/user-menu-dropdown.module.css";
import {
    PersonCircleIcon,
    PersonCircleNotificationIcon,
} from "decorator-icons";
import html from "decorator-shared/html";
import { LoginLevel } from "decorator-shared/params";
import { Notification } from "../../notifications";
import { HeaderButton } from "../components/header-button";
import { DropdownMenu } from "../dropdown-menu";
import { UserMenu } from "./user-menu";

export type UserMenuDropdownProps = {
    name: string;
    notifications: Notification[] | null;
    level: LoginLevel;
    loginUrl: string;
    logoutUrl: string;
    minsideUrl: string;
    personopplysningerUrl: string;
};

export const UserMenuDropdown = ({
    name,
    notifications,
    level,
    loginUrl,
    logoutUrl,
    minsideUrl,
    personopplysningerUrl,
}: UserMenuDropdownProps) => {
    return DropdownMenu({
        button: HeaderButton({
            content: html`<span class="${cls.name}">${name}</span>`,
            icon:
                notifications && notifications.length > 0
                    ? PersonCircleNotificationIcon({})
                    : PersonCircleIcon({}),
        }),
        dropdownClass: cls.userMenuDropdown,
        dropdownContent: UserMenu({
            name,
            notifications,
            level,
            loginUrl,
            logoutUrl,
            minsideUrl,
            personopplysningerUrl,
        }),
        attributes: {
            ["data-hj-suppress"]: true,
        },
    });
};
