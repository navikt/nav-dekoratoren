import clsx from 'clsx';
import menuCls from 'decorator-client/src/styles/complex-header-menu.module.css';
import cls from 'decorator-client/src/styles/header.module.css';
import menuItemsCls from 'decorator-client/src/styles/menu-items.module.css';
import opsMessagesCls from 'decorator-client/src/styles/ops-messages.module.css';
import { ContextLink } from 'decorator-shared/context';
import html from 'decorator-shared/html';
import {
  AvailableLanguage,
  Breadcrumb,
  Context,
  Language,
} from 'decorator-shared/params';
import { Texts } from 'decorator-shared/types';
import utilsCls from 'decorator-shared/utilities.module.css';
import { Breadcrumbs } from 'decorator-shared/views/header/decorator-utils-container/breadcrumbs';
import { LanguageSelector } from 'decorator-shared/views/header/decorator-utils-container/language-selector';
import {
  BurgerIcon,
  LoginIcon,
  SearchIcon,
} from 'decorator-shared/views/icons';
import { DropdownMenu } from '../dropdown-menu';
import { IconButton } from '../icon-button';
import { SearchForm } from '../search-form';

export type ComplexHeaderProps = {
  texts: Texts;
  context: Context;
  language: Language;
  contextLinks: ContextLink[];
  breadcrumbs: Breadcrumb[];
  availableLanguages: AvailableLanguage[];
};

export function ComplexHeader({
  language,
  contextLinks,
  texts,
  context: currentContext,
  breadcrumbs,
  availableLanguages,
}: ComplexHeaderProps) {
  // @TODO: Need id here for css vars.
  return html`
    <header class="${cls.siteheader}" id="header-withmenu">
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
                  <main-menu></main-menu>
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
    <decorator-utils>
      ${breadcrumbs.length > 0 &&
      html`<nav is="d-breadcrumbs">${Breadcrumbs({ breadcrumbs })}</nav>`}
      ${availableLanguages.length > 0 && LanguageSelector()}
    </decorator-utils>
    <menu-background></menu-background>
  `;
}
