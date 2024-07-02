import cls from "decorator-client/src/styles/user-menu-dropdown.module.css";
import { LoginLevel } from "decorator-shared/params";
import {
    PersonCircleIcon,
    PersonCircleNotificationIcon,
} from "decorator-shared/views/icons";
import { IconButton } from "../../../../shared/views/icon-button";
import { Notification } from "../../notifications";
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
