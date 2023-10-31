import cls from 'decorator-client/src/styles/complex-header-menu.module.css';
import html from 'decorator-shared/html';
import { MainMenuContextLink, LinkGroup, Texts } from 'decorator-shared/types';
import { SearchForm } from '../search-form';
import { MainMenu } from './main-menu';

export type ComplexHeaderMenuProps = {
  mainMenuTitle: string;
  frontPageUrl: string;
  texts: Texts;
  mainMenuLinks: LinkGroup[];
  contextLinks: MainMenuContextLink[];
};

export const ComplexHeaderMenu = ({
  mainMenuTitle,
  frontPageUrl,
  mainMenuLinks,
  contextLinks,
  texts,
}: ComplexHeaderMenuProps) => html`
  <div class="${cls.menuContent}">
    <search-menu class="${cls.searchMenu}">
      ${SearchForm({ texts })}
    </search-menu>
    <main-menu>
      ${MainMenu({
        title: mainMenuTitle,
        frontPageUrl,
        links: mainMenuLinks,
        contextLinks,
        texts,
      })}
    </main-menu>
  </div>
`;
