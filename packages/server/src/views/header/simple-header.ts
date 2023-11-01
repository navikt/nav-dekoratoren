import cls from 'decorator-client/src/styles/header.module.css';
import opsMessagesCls from 'decorator-client/src/styles/ops-messages.module.css';
import html from 'decorator-shared/html';
import type {
  AvailableLanguage,
  Breadcrumb,
  UtilsBackground,
} from 'decorator-shared/params';
import { Texts } from 'decorator-shared/types';
import utilsCls from 'decorator-shared/utilities.module.css';
import { DecoratorUtilsContainer } from 'decorator-shared/views/header/decorator-utils-container';
import { LoginIcon } from 'decorator-shared/views/icons';
import { LenkeMedSporing } from 'decorator-shared/views/lenke-med-sporing-helpers';
import { IconButton } from '../icon-button';

export type SimpleHeaderProps = {
  texts: Texts;
  availableLanguages: AvailableLanguage[];
  breadcrumbs: Breadcrumb[];
  utilsBackground: UtilsBackground;
};

export function SimpleHeader({
  availableLanguages,
  breadcrumbs,
  utilsBackground,
  texts,
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
    ${DecoratorUtilsContainer({
      utilsBackground,
      breadcrumbs,
      availableLanguages,
    })}
  `;
}
