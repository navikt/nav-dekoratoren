import { makeContextLinks } from 'decorator-shared/context';
import { Params } from 'decorator-shared/params';
import { DecoratorUtilsContainer } from 'decorator-shared/views/header/decorator-utils-container';
import { ScreensharingModal } from 'decorator-shared/views/screensharing-modal';
import ContentService from './content-service';
import { env } from './env/server';
import { texts } from './texts';
import UnleashService from './unleash-service';
import { Index } from './views';
import { DecoratorData } from './views/decorator-data';
import { DecoratorLens } from './views/decorator-lens';
import { Feedback } from './views/feedback';
import { ComplexFooter } from './views/footer/complex-footer';
import { SimpleFooter } from './views/footer/simple-footer';
import { ComplexHeader } from './views/header/complex-header';
import { SimpleHeader } from './views/header/simple-header';
import { LogoutWarning } from './views/logout-warning';
import { SplashPage } from './views/splash-page';

export default async ({
  contentService,
  unleashService,
  data,
  url: origin,
  query,
}: {
  contentService: ContentService;
  unleashService: UnleashService;
  data: Params;
  url: string;
  query: Record<string, unknown>;
}) => {
  const { language } = data;
  const localTexts = texts[language];

  const features = unleashService.getFeatures();

  const decoratorUtilsContainer =
    DecoratorUtilsContainer({
      availableLanguages: data.availableLanguages,
      breadcrumbs: data.breadcrumbs,
      utilsBackground: data.utilsBackground,
    }) ?? undefined;

  return (
    await Index({
      language,
      header:
        data.simple || data.simpleHeader
          ? SimpleHeader({
              texts: localTexts,
              decoratorUtilsContainer,
            })
          : ComplexHeader({
              texts: localTexts,
              contextLinks: makeContextLinks(env.XP_BASE_URL),
              context: data.context,
              language,
              decoratorUtilsContainer,
            }),
      feedback: data.feedback ? Feedback({ texts: localTexts }) : undefined,
      logoutWarning: data.logoutWarning ? LogoutWarning() : undefined,
      shareScreen: data.shareScreen
        ? ScreensharingModal({ texts: localTexts })
        : undefined,
      footer:
        data.simple || data.simpleFooter
          ? SimpleFooter({
              links: await contentService.getSimpleFooterLinks({ language }),
              texts: localTexts,
              features,
            })
          : ComplexFooter({
              texts: localTexts,
              links: await contentService.getComplexFooterLinks({
                language,
                context: data.context,
              }),
              features,
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
      }),
      maskDocument: data.maskHotjar,
      main:
        origin.includes('localhost') || origin.includes('dekoratøren')
          ? SplashPage()
          : undefined,
    })
  ).render();
};
