import cls from "decorator-client/src/styles/user-menu-dropdown.module.css";
import { LoginLevel } from "decorator-shared/params";
import { Texts } from "decorator-shared/types";
import {
    PersonCircleIcon,
    PersonCircleNotificationIcon,
} from "decorator-shared/views/icons";
import { DropdownMenu } from "../dropdown-menu";
import { IconButton } from "../icon-button";
import { UserMenu } from "./user-menu";
import { Notification } from "../../notifications";

export type UserMenuDropdownProps = {
    texts: Texts;
    name: string;
    notifications: Notification[] | null;
    level: LoginLevel;
    loginUrl: string;
    logoutUrl: string;
    minsideUrl: string;
    personopplysningerUrl: string;
};

export const UserMenuDropdown = ({
    texts,
    name,
    notifications,
    level,
    loginUrl,
    logoutUrl,
    minsideUrl,
    personopplysningerUrl,
}: UserMenuDropdownProps) => {
    return DropdownMenu({
        button: IconButton({
            className: cls.userMenuButton,
            text: name,
            Icon:
                notifications && notifications.length > 0
                    ? PersonCircleNotificationIcon({
                          className: cls.icon,
                      })
                    : PersonCircleIcon({
                          className: cls.icon,
                      }),
        }),
        dropdownClass: cls.userMenuDropdown,
        dropdownContent: UserMenu({
            texts,
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
