import cls from "decorator-client/src/styles/arbeidsgiver-user-menu.module.css";
import html from "decorator-shared/html";
import { BriefcaseIcon } from "decorator-shared/views/icons";
import i18n from "../../i18n";

export type ArbeidsgiverUserMenuProps = {
    href: string;
};

//@TODO add test case
export const ArbeidsgiverUserMenu = ({ href }: ArbeidsgiverUserMenuProps) =>
    html`<a class="${cls.arbeidsgiverUserMenu}" href="${href}">
        ${BriefcaseIcon({ className: cls.icon })}
        <div>
            <div class="${cls.heading}">${i18n("go_to_my_page")}</div>
            <div class="${cls.description}">${i18n("rolle_arbeidsgiver")}</div>
        </div>
    </a>`;
