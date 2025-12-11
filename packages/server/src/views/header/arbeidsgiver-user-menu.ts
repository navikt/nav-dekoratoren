import cls from "decorator-client/src/styles/arbeidsgiver-user-menu.module.css";
import utils from "decorator-client/src/styles/utils.module.css";
import html from "decorator-shared/html";
import { BriefcaseIcon, LeaveIcon } from "decorator-icons";
import i18n from "../../i18n";

export type ArbeidsgiverUserMenuProps = {
    href: string;
    logoutUrl: string;
    name: string;
};

export const ArbeidsgiverUserMenu = ({
    href,
    logoutUrl,
    name,
}: ArbeidsgiverUserMenuProps) => html`
    <div class="${cls.arbeidsgiverUserMenu}">
        <div class="${cls.menuItems}">
            <div class="${cls.menuHeader}">
                <div class="${cls.loggedIn}">${i18n("logged_in")}</div>
                <div class="${cls.name}">${name}</div>
            </div>
            <a href="${href}" class="${cls.menuItem}">
                ${BriefcaseIcon({ className: utils.icon })}
                <span>${i18n("my_page_employer")}</span>
            </a>
            <a href="${logoutUrl}" class="${cls.menuItem}">
                ${LeaveIcon({ className: utils.icon })}
                <span>${i18n("logout")}</span>
            </a>
        </div>
    </div>
`;
