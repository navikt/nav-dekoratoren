import { Header } from 'decorator-shared/views/header';
import { Index } from './views';
import { Footer } from './views/footer';
import { DecoratorEnv } from './views/decorator-env';
import { DecoratorLens } from './views/decorator-lens';

import { texts } from 'decorator-shared/texts';
import {
  getHeaderMenuLinks,
  getMyPageMenu,
  getMainMenu,
  getPersonvern,
  getFooterLinks,
} from './content';

export default ({ menu, data, url, query }) => {
  const localTexts = texts[data.language];

  return Index({
    language: data.language,
    header: Header({
      texts: localTexts,
      mainMenu: getMainMenu(menu, data.context),
      headerMenuLinks: getHeaderMenuLinks({
        menu,
        language: data.language,
        context: data.context,
      }),
      innlogget: false,
      isNorwegian: true,
      breadcrumbs: data.breadcrumbs,
      utilsBackground: data.utilsBackground,
      availableLanguages: data.availableLanguages,
      myPageMenu: getMyPageMenu(menu, data.language),
      simple: data.simple,
    }),
    footer: Footer({
      texts: localTexts,
      personvern: getPersonvern(menu),
      footerLinks: getFooterLinks(menu, data.language, data.context),
      simple: data.simple,
      feedback: data.feedback,
    }),
    env: DecoratorEnv({
      origin: url,
      env: data,
    }),
    lens: DecoratorLens({
      origin: url,
      env: data,
      query,
    }),
  });
};
