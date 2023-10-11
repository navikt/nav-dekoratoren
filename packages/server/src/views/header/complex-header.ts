import html from 'decorator-shared/html';
import {
  AvailableLanguage,
  Breadcrumb,
  Context,
  UtilsBackground,
} from 'decorator-shared/params';
import { Node, Texts } from 'decorator-shared/types';
import utilsCls from 'decorator-shared/utilities.module.css';
import { ComplexHeaderNavbarItems } from 'decorator-shared/views/header/navbar-items/complex-header-navbar-items';

export type ComplexHeaderProps = {
  isNorwegian: boolean;
  mainMenu?: Node[];
  texts: Texts;
  headerMenuLinks?: Node[];
  innlogget: boolean;
  breadcrumbs: Breadcrumb[];
  utilsBackground: UtilsBackground;
  availableLanguages: AvailableLanguage[];
  myPageMenu?: Node[];
  contextLinks: ContextLink[];
  context: Context;
};

import classes from 'decorator-client/src/styles/header.module.css';
import clsx from 'clsx';
import { HeaderContextLenke } from 'decorator-shared/views/header/lenke';
import { ContextLink } from 'decorator-shared/context';
import { LenkeMedSporing } from 'decorator-client/src/views/lenke-med-sporing-helpers';
import { DecoratorUtilsContainer } from 'decorator-shared/views/header/decorator-utils-container';
import { ComplexHeaderMenu } from './complex-header-menu';

export function ComplexHeader({
  isNorwegian,
  contextLinks,
  headerMenuLinks,
  texts,
  innlogget,
  breadcrumbs,
  utilsBackground,
  context,
  availableLanguages,
  myPageMenu,
}: ComplexHeaderProps) {
  return html`
    <div id="menu-background"></div>
    <header class="siteheader">
      <div class="hovedmeny-wrapper ${utilsCls.contentContainer}">
        <div class="hovedmeny-content">
          ${LenkeMedSporing({
            href: '/',
            analyticsEventArgs: {
              category: 'dekorator-header',
              action: 'navlogo',
            },
            attachContext: true,
            children: html`<img
              src="/public/ikoner/meny/nav-logo-red.svg"
              alt="NAV"
            />`,
          })}
          <div id="arbeidsflate">
            ${isNorwegian &&
            contextLinks?.map((link) =>
              HeaderContextLenke({
                link: link,
                text: texts[link.lenkeTekstId],
                classNameOverride: clsx([
                  classes.headerContextLink,
                  {
                    [classes.lenkeActive]: link.context === context,
                  },
                ]),
                containerClassName: classes.headerContextLinkContainer,
                attrs: [['data-context', link.context.toLowerCase()]],
              }),
            )}
          </div>
        </div>
        ${ComplexHeaderNavbarItems({
          innlogget,
          texts,
          myPageMenu,
        })}
        <div id="menu" class="${utilsCls.contentContainer}">
          ${ComplexHeaderMenu({ headerMenuLinks, texts })}
        </div>
      </div>
    </header>
    ${DecoratorUtilsContainer({
      utilsBackground,
      breadcrumbs,
      availableLanguages,
    })}
  `;
}
