import html from 'decorator-shared/html';
import { HeaderMenuLinks } from 'decorator-shared/views/header/header-menu-links';
import { Node, Texts } from 'decorator-shared/types';
import { LenkeMedSporing } from 'decorator-shared/views/lenke-med-sporing-helpers';
import cls from 'decorator-client/src/styles/complex-header-menu.module.css';
import { SearchForm } from 'decorator-shared/views/search-form';

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
      dataAttachContext: true,
      children: texts.til_forsiden,
    })}
  </div>
  <div class="${cls.menuContent}">
    <search-menu class="${cls.searchMenu}">
      ${SearchForm({ texts })}
    </search-menu>
    <div id="header-menu-links">
      ${HeaderMenuLinks({
        headerMenuLinks,
        className: 'cols-3',
      })}
    </div>
  </div>
`;
