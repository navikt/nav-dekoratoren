import clsx from 'clsx';
import menuCls from '@styles/complex-header-menu.module.json';
import cls from '@styles/header.module.json';
import menuItemsCls from '@styles/menu-items.module.json';
import opsMessagesCls from '@styles/ops-messages.module.json';
import { ContextLink } from 'decorator-shared/context';
import html, { Template } from 'decorator-shared/html';
import { Context, Language } from 'decorator-shared/params';
import { OpsMessage, Texts } from 'decorator-shared/types';
import utilsCls from '@styles/utilities.module.json';
import {
  BurgerIcon,
  LoginIcon,
  SearchIcon,
} from 'decorator-shared/views/icons';
import { DropdownMenu } from '../dropdown-menu';
import { IconButton } from '../icon-button';
import { SearchForm } from '../search-form';
import { OpsMessages } from '../ops-messages';
console.log(utilsCls);

export type ComplexHeaderProps = {
  texts: Texts;
  context: Context;
  language: Language;
  contextLinks: ContextLink[];
  decoratorUtils: Template;
  opsMessages: OpsMessage[];
};

export function ComplexHeader({
  language,
  contextLinks,
  texts,
  context: currentContext,
  decoratorUtils,
  opsMessages,
}: ComplexHeaderProps) {
  // @TODO: Need id here for css vars.
  return html`
    <div id="decorator-header">
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
              <img src="/ikoner/meny/nav-logo-red.svg" alt="NAV" />
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
              ${language !== 'se' &&
              DropdownMenu({
                button: IconButton({
                  Icon: BurgerIcon(),
                  text: texts.menu,
                }),
                dropdownContent: html`
                  <search-menu class="${menuCls.searchMenu}">
                    ${SearchForm({ texts })}
                  </search-menu>
                  <main-menu></main-menu>
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
                  <search-menu
                    class="${menuItemsCls.searchMenu}"
                    data-auto-focus
                  >
                    ${SearchForm({ texts })}
                  </search-menu>
                `,
              })}
            </div>
          </div>
        </div>
      </header>
      <ops-messages class="${opsMessagesCls.opsMessages}"
        >${opsMessages.length > 0 && OpsMessages({ opsMessages })}</ops-messages
      >
      ${decoratorUtils}
      <menu-background></menu-background>
    </div>
  `;
}
