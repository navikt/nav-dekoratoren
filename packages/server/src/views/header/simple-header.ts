import { LenkeMedSporing } from 'decorator-client/src/views/lenke-med-sporing-helpers';
import html from 'decorator-shared/html';
import type {
  AvailableLanguage,
  Breadcrumb,
  Context,
  UtilsBackground,
} from 'decorator-shared/params';
import { Texts } from 'decorator-shared/types';
import cls from 'decorator-shared/utilities.module.css';
import { SimpleHeaderNavbarItems } from 'decorator-shared/views/header/navbar-items/simple-header-navbar-items';
import { DecoratorUtilsContainer } from 'decorator-shared/views/header/decorator-utils-container';

export type SimpleHeaderProps = {
  texts: Texts;
  innlogget: boolean;
  availableLanguages: AvailableLanguage[];
  breadcrumbs: Breadcrumb[];
  utilsBackground: UtilsBackground;
  activeContext: Context;
};

export function SimpleHeader({
  availableLanguages,
  breadcrumbs,
  utilsBackground,
  innlogget,
  texts,
  activeContext,
}: SimpleHeaderProps) {
  return html`
    <div id="menu-background"></div>
    <header class="siteheader">
      <div class="hovedmeny-wrapper ${cls.contentContainer}">
        <div class="hovedmeny-content">
          ${LenkeMedSporing({
            href: '/',
            analyticsEventArgs: {
              context: activeContext,
              category: 'dekorator-header',
              action: 'navlogo',
            },
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
