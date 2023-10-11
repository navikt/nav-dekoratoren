import { SimpleHeader } from './views/header/simple-header';
import { ComplexHeader } from './views/header/complex-header';
import { Index } from './views';
import { Feedback } from './views/feedback';
import { DecoratorLens } from './views/decorator-lens';
import { DecoratorData } from './views/decorator-data';
import { texts } from './texts';
import ContentService from './content-service';
import { Params } from 'decorator-shared/params';
import { SimpleFooter } from './views/footer/simple-footer';
import { ComplexFooter } from './views/footer/complex-footer';
import { LogoutWarning } from './views/logout-warning';
import { Link, LinkGroup } from 'decorator-shared/types';
import { makeContextLinks } from 'decorator-shared/context';
import { env } from './env/server';

export default async ({
  contentService,
  data,
  url: origin,
  query,
}: {
  contentService: ContentService;
  data: Params;
  url: string;
  query: Record<string, unknown>;
}) => {
  const { language } = data;
  const localTexts = texts[language];

  // Passing directly for clarity
  const { mainMenu, headerMenuLinks, myPageMenu, footerLinks } =
    await contentService.getFirstLoad({
      language,
      context: data.context,
      simple: data.simple,
      simpleFooter: data.simpleFooter,
    });

  const contextLinks = makeContextLinks(env.XP_BASE_URL);

  return (
    await Index({
      language,
      header:
        data.simple || data.simpleHeader
          ? SimpleHeader({
              texts: localTexts,
              innlogget: false,
              breadcrumbs: data.breadcrumbs,
              utilsBackground: data.utilsBackground,
              availableLanguages: data.availableLanguages,
            })
          : ComplexHeader({
              mainMenu,
              headerMenuLinks,
              myPageMenu,
              texts: localTexts,
              innlogget: false,
              contextLinks,
              context: data.context,
              isNorwegian: true,
              breadcrumbs: data.breadcrumbs,
              utilsBackground: data.utilsBackground,
              availableLanguages: data.availableLanguages,
            }),
      feedback: data.feedback ? Feedback({ texts: localTexts }) : undefined,
      logoutWarning: data.logoutWarning ? LogoutWarning() : undefined,
      footer:
        data.simple || data.simpleFooter
          ? SimpleFooter({
              links: footerLinks as Link[],
              texts: localTexts,
            })
          : ComplexFooter({
              texts: localTexts,
              links: footerLinks as LinkGroup[],
            }),
      lens: DecoratorLens({
        origin,
        env: data,
        query,
      }),
      decoratorData: DecoratorData({
        texts: localTexts,
        params: data,
      }),
    })
  ).render();
};
