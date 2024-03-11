import html from 'decorator-shared/html';
import { Texts } from 'decorator-shared/types';
import { BriefcaseIcon } from 'decorator-shared/views/icons';
import cls from 'decorator-client/src/styles/arbeidsgiver-user-menu.module.css';

export type ArbeidsgiverUserMenuProps = {
    texts: Texts;
    href: string;
};

    //@TODO add test case
export const ArbeidsgiverUserMenu = ({ texts, href }: ArbeidsgiverUserMenuProps) =>
    html`<a class="${cls.arbeidsgiverUserMenu}" href="${href}">
        ${BriefcaseIcon({ className: cls.icon })}
        <div>
            <div class="${cls.heading}">${texts.go_to_my_page}</div>
            <div class="${cls.description}">${texts.rolle_arbeidsgiver}</div>
        </div>
    </a>`;
