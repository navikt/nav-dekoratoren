import clsx from 'clsx';
import html from 'decorator-shared/html';
import {
  AvailableLanguage,
  Breadcrumb,
  Context,
  UtilsBackground,
} from 'decorator-shared/params';
import { Node, Texts } from 'decorator-shared/types';
import { ComplexHeaderNavbarItems } from 'decorator-shared/views/header/navbar-items/complex-header-navbar-items';
import { ContextLink } from 'decorator-shared/context';
import { LenkeMedSporing } from 'decorator-shared/views/lenke-med-sporing-helpers';
import { DecoratorUtilsContainer } from 'decorator-shared/views/header/decorator-utils-container';
import cls from 'decorator-client/src/styles/header.module.css';
import utilsCls from 'decorator-shared/utilities.module.css';

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
  name?: string;
};

export function ComplexHeader({
  isNorwegian,
  contextLinks,
  headerMenuLinks,
  texts,
  innlogget,
  breadcrumbs,
  utilsBackground,
  context: currentContext,
  availableLanguages,
  myPageMenu,
  name,
}: ComplexHeaderProps) {
  return html`
    <header class="${cls.siteheader}">
      <div class="${cls.wrapperWrapper}">
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
                src="/public/ikoner/meny/nav-logo-red.svg"
                alt="NAV"
              />`,
            })}
            <div class="${cls.arbeidsflate}">
              ${isNorwegian &&
              contextLinks?.map(({ url, lenkeTekstId, context }) =>
                LenkeMedSporing({
                  href: url,
                  children: texts[lenkeTekstId],
                  className: clsx(cls.headerContextLink, {
                    [cls.lenkeActive]: context === currentContext,
                  }),
                  dataAttachContext: true,
                  analyticsEventArgs: {
                    action: 'arbeidsflate-valg',
                    category: 'dekorator-header',
                    label: context,
                  },
                  dataContext: context.toLowerCase(),
                }),
              )}
            </div>
          </div>
          ${ComplexHeaderNavbarItems({
            innlogget,
            texts,
            myPageMenu: myPageMenu as Node[],
            headerMenuLinks,
            name,
          })}
        </div>
      </div>
    </header>
    ${DecoratorUtilsContainer({
      utilsBackground,
      breadcrumbs,
      availableLanguages,
    })}
    <menu-background />
  `;
}
