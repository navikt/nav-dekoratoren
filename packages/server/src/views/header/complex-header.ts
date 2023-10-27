import clsx from 'clsx';
import html from 'decorator-shared/html';
import {
  AvailableLanguage,
  Breadcrumb,
  Context,
  Language,
  UtilsBackground,
} from 'decorator-shared/params';
import {
  LinkGroup,
  MainMenuContextLink,
  Node,
  Texts,
} from 'decorator-shared/types';
import { ComplexHeaderNavbarItems } from 'decorator-shared/views/header/navbar-items/complex-header-navbar-items';
import { ContextLink } from 'decorator-shared/context';
import { LenkeMedSporing } from 'decorator-shared/views/lenke-med-sporing-helpers';
import { DecoratorUtilsContainer } from 'decorator-shared/views/header/decorator-utils-container';
import cls from 'decorator-client/src/styles/header.module.css';
import utilsCls from 'decorator-shared/utilities.module.css';

const frontPageUrl = (context: Context, language: Language) => {
  if (language === 'en') {
    return `${process.env.XP_BASE_URL}/en/home`;
  }

  switch (context) {
    case 'privatperson':
      return `${process.env.XP_BASE_URL}/`;
    case 'arbeidsgiver':
      return `${process.env.XP_BASE_URL}/no/bedrift`;
    case 'samarbeidspartner':
      return `${process.env.XP_BASE_URL}/no/samarbeidspartner`;
  }
};

export type ComplexHeaderProps = {
  texts: Texts;
  innlogget: boolean;
  breadcrumbs: Breadcrumb[];
  utilsBackground: UtilsBackground;
  availableLanguages: AvailableLanguage[];
  myPageMenu?: Node[];
  context: Context;
  name?: string;
  language: Language;
  mainMenuLinks: LinkGroup[];
  mainMenuContextLinks: MainMenuContextLink[];
  contextLinks: ContextLink[];
};

export function ComplexHeader({
  language,
  contextLinks,
  mainMenuLinks,
  mainMenuContextLinks,
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
            ${language === 'nb' &&
            contextLinks?.map(
              ({ url, lenkeTekstId, context }) =>
                html`<a
                  is="context-link"
                  href="${url}"
                  data-analytics-event-args="${JSON.stringify({
                    action: 'arbeidsflate-valg',
                    category: 'dekorator-header',
                    label: context,
                  })}"
                  class="${clsx(cls.headerContextLink, {
                    [cls.lenkeActive]: context === currentContext,
                  })}"
                  data-attach-context
                  data-context="${context.toLowerCase()}"
                >
                  ${texts[lenkeTekstId]}
                </a>`,
            )}
          </div>
        </div>
        ${ComplexHeaderNavbarItems({
          mainMenuTitle:
            currentContext === 'privatperson'
              ? texts.how_can_we_help
              : texts[`rolle_${currentContext}`],
          frontPageUrl: frontPageUrl(currentContext, language),
          innlogget,
          texts,
          myPageMenu: myPageMenu as Node[],
          mainMenuLinks,
          contextLinks: mainMenuContextLinks,
          name,
        })}
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
