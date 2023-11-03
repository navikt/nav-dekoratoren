import clsx from 'clsx';
import menuCls from 'decorator-client/src/styles/complex-header-menu.module.css';
import cls from 'decorator-client/src/styles/header.module.css';
import menuItemsCls from 'decorator-client/src/styles/menu-items.module.css';
import opsMessagesCls from 'decorator-client/src/styles/ops-messages.module.css';
import { ContextLink } from 'decorator-shared/context';
import html, { Template } from 'decorator-shared/html';
import { Context, Language } from 'decorator-shared/params';
import { LinkGroup, MainMenuContextLink, Texts } from 'decorator-shared/types';
import utilsCls from 'decorator-shared/utilities.module.css';
import {
  BurgerIcon,
  LoginIcon,
  SearchIcon,
} from 'decorator-shared/views/icons';
import { DropdownMenu } from '../dropdown-menu';
import { IconButton } from '../icon-button';
import { SearchForm } from '../search-form';
import { MainMenu } from './main-menu';

const frontPageUrl = (context: Context, language: Language) => {
  if (language === 'en') {
    return `${process.env.XP_BASE_URL}/en/home`;
  }

  switch (context) {
    case 'privatperson':
      return `${process.env.XP_BASE_URL}/`;
    case 'arbeidsgiver':
      return `${process.env.XP_BASE_URL}/no/bedrift`;
    case 'samarbeidspartner':
      return `${process.env.XP_BASE_URL}/no/samarbeidspartner`;
  }
};

export type ComplexHeaderProps = {
  texts: Texts;
  decoratorUtilsContainer?: Template;
  context: Context;
  language: Language;
  mainMenuLinks: LinkGroup[];
  mainMenuContextLinks: MainMenuContextLink[];
  contextLinks: ContextLink[];
};

export function ComplexHeader({
  language,
  contextLinks,
  mainMenuLinks,
  mainMenuContextLinks,
  texts,
  context: currentContext,
  decoratorUtilsContainer,
}: ComplexHeaderProps) {
  return html`
    <header class="${cls.siteheader}">
      <div class="${cls.hovedmenyWrapper} ${utilsCls.contentContainer}">
        <div class="${cls.hovedmenyContent}">
          <a
            is="lenke-med-sporing"
            href="/"
            class="${cls.logo}"
            data-analytics-event-args="${JSON.stringify({
              category: 'dekorator-header',
              action: 'navlogo',
            })}"
            data-attach-context
          >
            <img src="/public/ikoner/meny/nav-logo-red.svg" alt="NAV" />
          </a>
          <div class="${cls.arbeidsflate}">
            ${language === 'nb' &&
            contextLinks?.map(
              ({ url, lenkeTekstId, context }) =>
                html`<a
                  is="context-link"
                  href="${url}"
                  data-analytics-event-args="${JSON.stringify({
                    action: 'arbeidsflate-valg',
                    category: 'dekorator-header',
                    label: context,
                  })}"
                  class="${clsx(cls.headerContextLink, {
                    [cls.lenkeActive]: context === currentContext,
                  })}"
                  data-attach-context
                  data-context="${context.toLowerCase()}"
                >
                  ${texts[lenkeTekstId]}
                </a>`,
            )}
          </div>
        </div>
        <div class="${menuItemsCls.menuItems}">
          <user-menu>
            ${IconButton({
              id: 'login-button',
              Icon: LoginIcon({}),
              text: texts.login,
            })}
          </user-menu>
          <div class="${menuItemsCls.menuItemsUniversalLinks}">
            ${DropdownMenu({
              button: IconButton({
                Icon: BurgerIcon(),
                text: texts.menu,
              }),
              dropdownContent: html`
                <div class="${menuCls.menuContent}">
                  <search-menu class="${menuCls.searchMenu}">
                    ${SearchForm({ texts })}
                  </search-menu>
                  <main-menu>
                    ${MainMenu({
                      title:
                        currentContext === 'privatperson'
                          ? texts.how_can_we_help
                          : texts[`rolle_${currentContext}`],

                      frontPageUrl: frontPageUrl(currentContext, language),
                      links: mainMenuLinks,
                      contextLinks: mainMenuContextLinks,
                      texts,
                    })}
                  </main-menu>
                </div>
              `,
            })}
            ${DropdownMenu({
              button: IconButton({
                Icon: SearchIcon({
                  menuSearch: true,
                }),
                text: texts.search,
                className: menuItemsCls.searchButton,
              }),
              dropdownClass: menuItemsCls.searchDropdown,
              dropdownContent: html`
                <search-menu class="${menuItemsCls.searchMenu}" data-auto-focus>
                  ${SearchForm({ texts })}
                </search-menu>
              `,
            })}
          </div>
        </div>
      </div>
    </header>
    <ops-messages class="${opsMessagesCls.opsMessages}"></ops-messages>
    ${decoratorUtilsContainer}
    <menu-background />
  `;
}
