import { Header } from 'decorator-shared/views/header';
import { Index } from './views';
import { Footer } from './views/footer';
import { DecoratorEnv } from './views/decorator-env';
import { DecoratorLens } from './views/decorator-lens';

import { texts } from 'decorator-shared/texts';

export default async ({ contentService, data, url: origin, query }) => {
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
    footer: Footer({
      texts: localTexts,
      personvern: await contentService.getPersonvern(),
      footerLinks: await contentService.getFooterLinks(data),
      simple: data.simple,
      feedback: data.feedback,
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
  });
};
