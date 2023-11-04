import cls from 'decorator-client/src/styles/header.module.css';
import menuItemsCls from 'decorator-client/src/styles/menu-items.module.css';
import opsMessagesCls from 'decorator-client/src/styles/ops-messages.module.css';
import html from 'decorator-shared/html';
import { Texts } from 'decorator-shared/types';
import utilsCls from 'decorator-shared/utilities.module.css';
import { LoginIcon } from 'decorator-shared/views/icons';
import { IconButton } from '../icon-button';

export type SimpleHeaderProps = {
  texts: Texts;
};

export const SimpleHeader = ({ texts }: SimpleHeaderProps) => html`
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
  <decorator-utils></decorator-utils>
`;
