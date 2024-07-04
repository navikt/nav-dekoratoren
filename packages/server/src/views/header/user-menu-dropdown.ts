import cls from "decorator-client/src/styles/user-menu-dropdown.module.css";
import { LoginLevel } from "decorator-shared/params";
import menuItemsCls from "decorator-client/src/styles/menu-items.module.css";
import {
    PersonCircleIcon,
    PersonCircleNotificationIcon,
} from "decorator-shared/views/icons";
import { Notification } from "../../notifications";
import { Button } from "../button";
import { DropdownMenu } from "../dropdown-menu";
import { UserMenu } from "./user-menu";
import clsx from "clsx";

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
        button: Button({
            className: clsx(cls.userMenuButton, menuItemsCls.menuItem),
            content: { render: () => name },
            icon:
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
