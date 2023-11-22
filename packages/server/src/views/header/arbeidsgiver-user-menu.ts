import html from 'decorator-shared/html';
import { Texts } from 'decorator-shared/types';
import { BriefcaseIcon } from 'decorator-shared/views/icons';
import cls from '@styles/arbeidsgiver-user-menu.module.json';

export type ArbeidsgiverUserMenuProps = {
  texts: Texts;
};

export const ArbeidsgiverUserMenu = ({ texts }: ArbeidsgiverUserMenuProps) =>
  html`<button class="${cls.arbeidsgiverUserMenu}">
    ${BriefcaseIcon({ className: cls.icon })}
    <div>
      <div class="${cls.heading}">${texts.go_to_my_page}</div>
      <div class="${cls.description}">${texts.rolle_arbeidsgiver}</div>
    </div>
  </button>`;
