import cls from "decorator-client/src/styles/arbeidsgiver-user-menu.module.css";
import html from "decorator-shared/html";
import { Texts } from "decorator-shared/types";
import { LogoutIcon } from "decorator-shared/views/icons/logout";
import { Buildings3Icon } from "./../../../../shared/views/icons/buildings3icon";

export type ArbeidsgiverUserMenuProps = {
    texts: Texts;
    href: string;
    logoutUrl: string;
    name: string;
};

//@TODO add test case
export const ArbeidsgiverUserMenu = ({
    texts,
    href,
    logoutUrl,
    name,
}: ArbeidsgiverUserMenuProps) =>
    html` <div class="${cls.arbeidsgiverUserMenu}">
        <div class="${cls.menuItems}">
            <div class="${cls.menuHeader}">
                <div class="${cls.loggedIn}">${texts.logged_in}</div>
                <div class="${cls.name}">${name}</div>
            </div>
            <a href="${href}" class="${cls.menuItem}">
                ${Buildings3Icon({ className: cls.menuItemIcon })}
                <span>${texts.my_page_employer}</span>
            </a>
            <a href="${logoutUrl}" class="${cls.menuItem} ${cls.logout}">
                ${LogoutIcon({})}
                <span>Logg ut</span>
            </a>
        </div>
    </div>`;
