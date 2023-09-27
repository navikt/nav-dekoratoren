import { Header } from 'decorator-shared/views/header';
import { Index } from './views';
import { Feedback } from './views/feedback';
import { DecoratorEnv } from './views/decorator-env';
import { DecoratorLens } from './views/decorator-lens';
import { DecoratorData } from './views/decorator-data';
import { texts } from './texts';
import ContentService from './content-service';
import { Params } from 'decorator-shared/params';
import { SimpleFooter } from './views/footer/simple-footer';
import { ComplexFooter } from './views/footer/complex-footer';
import { LogoutWarning } from './views/logoutWarning';

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

  return Index({
    language,
    header: Header({
      texts: localTexts,
      mainMenu: await contentService.getMainMenu(data),
      headerMenuLinks: await contentService.getHeaderMenuLinks(data),
      innlogget: false,
      isNorwegian: true,
      breadcrumbs: data.breadcrumbs,
      utilsBackground: data.utilsBackground,
      availableLanguages: data.availableLanguages,
      myPageMenu: await contentService.getMyPageMenu(data),
      simple: data.simple,
    }),
    feedback: data.feedback ? Feedback({ texts: localTexts }) : '',
    logoutWarning: data.logoutWarning ? LogoutWarning() : '',
    footer:
      data.simple || data.simpleFooter
        ? SimpleFooter({
            links: await contentService.getSimpleFooterLinks(data),
          })
        : ComplexFooter({
            texts: localTexts,
            links: await contentService.getComplexFooterLinks(data),
          }),
    env: DecoratorEnv({
      origin,
      env: data,
    }),
    lens: DecoratorLens({
      origin,
      env: data,
      query,
    }),
    decoratorData: DecoratorData({
      texts: localTexts,
    }),
  });
};
