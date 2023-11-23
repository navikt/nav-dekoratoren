import { makeContextLinks } from 'decorator-shared/context';
import { Params } from 'decorator-shared/params';
import ContentService from './content-service';
import { clientEnv, env } from './env/server';
import { texts } from './texts';
import { GetFeatures } from './unleash-service';
import { Index } from './views';
import { DecoratorData } from './views/decorator-data';
import { DecoratorLens } from './views/decorator-lens';
import { DecoratorUtils } from './views/decorator-utils';
import { ComplexHeader } from './views/header/complex-header';
import { SimpleHeader } from './views/header/simple-header';
import { getSplashPage } from './views/splash-page';
import { Footer } from './views/footer/footer';

export default async ({
  contentService,
  unleashService,
  data,
  url: origin,
  query,
}: {
  contentService: ContentService;
  unleashService: GetFeatures;
  data: Params;
  url: string;
  query: Record<string, unknown>;
}) => {
  const { language, breadcrumbs, availableLanguages } = data;
  const localTexts = texts[language];

  const features = unleashService.getFeatures();

  const decoratorUtils = DecoratorUtils({
    breadcrumbs,
    availableLanguages,
    utilsBackground: data.utilsBackground,
  });

  return Index({
    language,
    header:
      data.simple || data.simpleHeader
        ? SimpleHeader({
            texts: localTexts,
            decoratorUtils,
          })
        : ComplexHeader({
            texts: localTexts,
            contextLinks: makeContextLinks(env.XP_BASE_URL),
            context: data.context,
            language,
            decoratorUtils,
            opsMessages: data.ssr ? await contentService.getOpsMessages() : [],
          }),
    footer: Footer({
      ...(data.simple || data.simpleFooter
        ? {
            simple: true,
            links: await contentService.getSimpleFooterLinks({
              language,
            }),
          }
        : {
            simple: false,
            links: await contentService.getComplexFooterLinks({
              language,
              context: data.context,
            }),
          }),
      data,
      features,
      texts: localTexts,
    }),
    lens: DecoratorLens({
      origin,
      env: data,
      query,
    }),
    decoratorData: DecoratorData({
      texts: localTexts,
      params: data,
      features,
      environment: clientEnv,
    }),
    maskDocument: data.maskHotjar,
    main: getSplashPage(origin),
  }).render();
};
