import cls from 'decorator-client/src/styles/header.module.css';
import opsMessagesCls from 'decorator-client/src/styles/ops-messages.module.css';
import html, { Template } from 'decorator-shared/html';
import { Texts } from 'decorator-shared/types';
import utilsCls from 'decorator-shared/utilities.module.css';
import { LoginIcon } from 'decorator-shared/views/icons';
import { LenkeMedSporing } from 'decorator-shared/views/lenke-med-sporing-helpers';
import { IconButton } from '../icon-button';

export type SimpleHeaderProps = {
  texts: Texts;
  decoratorUtilsContainer?: Template;
};

export function SimpleHeader({
  texts,
  decoratorUtilsContainer,
}: SimpleHeaderProps) {
  return html`
    <header class="${cls.siteheader}">
      <div class="${cls.hovedmenyWrapper} ${utilsCls.contentContainer}">
        <div class="${cls.hovedmenyContent}">
          ${LenkeMedSporing({
            className: cls.logo,
            href: '/',
            analyticsEventArgs: {
              category: 'dekorator-header',
              action: 'navlogo',
            },
            dataAttachContext: true,
            children: html`<img
              src="/public/ikoner/meny/nav-logo-black.svg"
              alt="NAV"
            />`,
          })}
        </div>
        <user-menu class="${cls.menuItems}">
          ${IconButton({
            id: 'login-button',
            Icon: LoginIcon({}),
            text: texts.login,
          })}
        </user-menu>
      </div>
    </header>
    <ops-messages class="${opsMessagesCls.opsMessages}"></ops-messages>
    ${decoratorUtilsContainer}
  `;
}
