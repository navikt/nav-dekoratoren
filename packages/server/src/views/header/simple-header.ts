import { LenkeMedSporing } from 'decorator-client/src/views/lenke-med-sporing/lenke-med-sporing-helpers';
import html from 'decorator-shared/html';
import type {
  AvailableLanguage,
  Breadcrumb,
  UtilsBackground,
} from 'decorator-shared/params';
import { Texts } from 'decorator-shared/types';
import utilCls from 'decorator-shared/utilities.module.css';
import { SimpleHeaderNavbarItems } from 'decorator-shared/views/header/navbar-items/simple-header-navbar-items';
import { DecoratorUtilsContainer } from 'decorator-shared/views/header/decorator-utils-container';
import classes from 'decorator-client/src/styles/header.module.css';

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
    <header class="${classes.siteheader}">
      <div class="${classes.hovedmenyWrapper} ${utilCls.contentContainer}">
        <div class="${classes.hovedmenyContent}">
          ${LenkeMedSporing({
            href: '/',
            analyticsEventArgs: {
              category: 'dekorator-header',
              action: 'navlogo',
            },
            attachContext: true,
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
    ${DecoratorUtilsContainer({
      utilsBackground,
      breadcrumbs,
      availableLanguages,
    })}
  `;
}
