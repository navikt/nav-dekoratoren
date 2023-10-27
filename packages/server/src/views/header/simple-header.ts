import { LenkeMedSporing } from 'decorator-shared/views/lenke-med-sporing-helpers';
import html from 'decorator-shared/html';
import type {
  AvailableLanguage,
  Breadcrumb,
  UtilsBackground,
} from 'decorator-shared/params';
import { Texts } from 'decorator-shared/types';
import { SimpleHeaderNavbarItems } from 'decorator-shared/views/header/navbar-items/simple-header-navbar-items';
import { DecoratorUtilsContainer } from 'decorator-shared/views/header/decorator-utils-container';
import cls from 'decorator-client/src/styles/header.module.css';
import utilCls from 'decorator-shared/utilities.module.css';
import opsMessagesCls from 'decorator-client/src/styles/ops-messages.module.css';

export type SimpleHeaderProps = {
  texts: Texts;
  innlogget: boolean;
  availableLanguages: AvailableLanguage[];
  breadcrumbs: Breadcrumb[];
  utilsBackground: UtilsBackground;
};

export function SimpleHeader({
  availableLanguages,
  breadcrumbs,
  utilsBackground,
  innlogget,
  texts,
}: SimpleHeaderProps) {
  return html`
    <header class="${cls.siteheader}">
      <div class="${cls.hovedmenyWrapper} ${utilCls.contentContainer}">
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
        ${SimpleHeaderNavbarItems({
          innlogget,
          texts,
          name: '',
        })}
      </div>
    </header>
    <ops-messages class="${opsMessagesCls.opsMessages}" />
    ${DecoratorUtilsContainer({
      utilsBackground,
      breadcrumbs,
      availableLanguages,
    })}
  `;
}
