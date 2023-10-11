import html from 'decorator-shared/html';
import { HeaderMenuLinks } from 'decorator-shared/views/header/header-menu-links';
import { Node, Texts } from 'decorator-shared/types';
import { LenkeMedSporing } from 'decorator-client/src/views/lenke-med-sporing-helpers';
import cls from 'decorator-client/src/styles/complex-header-menu.module.css';

export type ComplexHeaderMenuProps = {
  texts: Texts;
  headerMenuLinks?: Node[];
};

export const ComplexHeaderMenu = ({
  headerMenuLinks,
  texts,
}: ComplexHeaderMenuProps) => html`
  <div class="${cls.menuTop}">
    <h2>${texts.how_can_we_help}</h2>
    ${LenkeMedSporing({
      href: '#',
      analyticsEventArgs: {
        category: 'dekorator-meny',
        action: 'hovedmeny/forsidelenke',
      },
      attachContext: true,
      children: html`${texts.til_forsiden}`,
    })}
  </div>
  <div class="${cls.menuContent}">
    <div class="${cls.inlineSearch}">
      <inline-search></inline-search>
    </div>
    <decorator-loader class="${cls.searchLoader}"></decorator-loader>
    <div id="header-menu-links">
      ${HeaderMenuLinks({
        headerMenuLinks: headerMenuLinks as Node[],
        className: 'cols-3',
      })}
    </div>
  </div>
`;
