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
import UnleashService from './unleash-service';
import { makeContextLinks } from 'decorator-shared/context';
import { env } from './env/server';
import { SplashPage } from './views/splash-page';
import { ScreensharingModal } from 'decorator-shared/views/screensharing-modal';

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

  // Passing directly for clarity
  const { myPageMenu, footerLinks, mainMenuLinks } =
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
              myPageMenu,
              texts: localTexts,
              innlogget: false,
              contextLinks,
              context: data.context,
              language,
              breadcrumbs: data.breadcrumbs,
              utilsBackground: data.utilsBackground,
              availableLanguages: data.availableLanguages,
              mainMenuLinks,
              mainMenuContextLinks: await contentService.mainMenuContextLinks({
                context: data.context,
                bedrift: data.bedrift,
              }),
            }),
      feedback: data.feedback ? Feedback({ texts: localTexts }) : undefined,
      logoutWarning: data.logoutWarning ? LogoutWarning() : undefined,
      shareScreen: data.shareScreen ? ScreensharingModal({ texts: localTexts }) : undefined,
      footer:
        data.simple || data.simpleFooter
          ? SimpleFooter({
              links: footerLinks as Link[],
              texts: localTexts,
              features,
            })
          : ComplexFooter({
              texts: localTexts,
              links: footerLinks as LinkGroup[],
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
