import cls from 'decorator-client/src/styles/header.module.css';
import menuItemsCls from 'decorator-client/src/styles/menu-items.module.css';
import opsMessagesCls from 'decorator-client/src/styles/ops-messages.module.css';
import html from 'decorator-shared/html';
import { Texts } from 'decorator-shared/types';
import utilsCls from 'decorator-shared/utilities.module.css';
import { LoginIcon } from 'decorator-shared/views/icons';
import { IconButton } from '../icon-button';
import { AvailableLanguage, Breadcrumb } from 'decorator-shared/params';
import { Breadcrumbs } from 'decorator-shared/views/header/decorator-utils-container/breadcrumbs';
import { LanguageSelector } from 'decorator-shared/views/header/decorator-utils-container/language-selector';

export type SimpleHeaderProps = {
  texts: Texts;
  breadcrumbs: Breadcrumb[];
  availableLanguages: AvailableLanguage[];
};

export const SimpleHeader = ({
  texts,
  breadcrumbs,
  availableLanguages,
}: SimpleHeaderProps) => html`
  <header class="${cls.siteheader}">
    <div class="${cls.hovedmenyWrapper} ${utilsCls.contentContainer}">
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
        <img src="/public/ikoner/meny/nav-logo-black.svg" alt="NAV" />
      </a>
      <user-menu class="${menuItemsCls.menuItems}">
        ${IconButton({
          id: 'login-button',
          Icon: LoginIcon({}),
          text: texts.login,
        })}
      </user-menu>
    </div>
  </header>
  <ops-messages class="${opsMessagesCls.opsMessages}"></ops-messages>
  <decorator-utils>
    ${breadcrumbs.length > 0 && Breadcrumbs({ breadcrumbs })}
    ${availableLanguages.length > 0 && LanguageSelector()}
  </decorator-utils>
`;
