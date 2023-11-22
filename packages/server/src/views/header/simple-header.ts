import cls from '@styles/header.module.json';
import menuItemsCls from '@styles/menu-items.module.json';
import opsMessagesCls from '@styles/ops-messages.module.json';
import html, { Template } from 'decorator-shared/html';
import { Texts } from 'decorator-shared/types';
import utilsCls from '@styles/utilities.module.json';
import { LoginIcon } from 'decorator-shared/views/icons';
import { IconButton } from '../icon-button';

export type SimpleHeaderProps = {
  texts: Texts;
  decoratorUtils: Template;
};

export const SimpleHeader = ({
  texts,
  decoratorUtils,
}: SimpleHeaderProps) => html`
  <div id="decorator-header">
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
          <img src="/ikoner/meny/nav-logo-black.svg" alt="NAV" />
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
    ${decoratorUtils}
  </div>
`;
