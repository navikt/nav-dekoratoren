import { makeContextLinks } from "decorator-shared/context";
import { Params } from "decorator-shared/params";
import { Features, Texts } from "decorator-shared/types";
import ContentService from "./content-service";
import { clientEnv, env } from "./env/server";
import { texts as i18n } from "./texts";
import { GetFeatures } from "./unleash-service";
import { Index } from "./views";
import { DecoratorData } from "./views/decorator-data";
import { DecoratorUtils } from "./views/decorator-utils";
import { Footer } from "./views/footer/footer";
import { ComplexHeader } from "./views/header/complex-header";
import { SimpleHeader } from "./views/header/simple-header";
import { getSplashPage } from "./views/splash-page";

export default async ({
    contentService,
    unleashService,
    data,
    url,
}: {
    contentService: ContentService;
    unleashService: GetFeatures;
    data: Params;
    url: string;
}) => {
    const { language } = data;
    const texts = i18n[language];

    const features = unleashService.getFeatures();

    return Index({
        language,
        header: await renderHeader({
            texts,
            data,
        }),
        footer: await renderFooter({
            texts,
            data,
            features,
            contentService,
        }),
        decoratorData: DecoratorData({
            texts,
            params: data,
            features,
            environment: clientEnv,
        }),
        maskDocument: data.maskHotjar,
        main: getSplashPage(url),
    }).render();
};

export function renderHeader({
    texts,
    data: {
        breadcrumbs,
        availableLanguages,
        utilsBackground,
        simple,
        simpleHeader,
        context,
        language,
    },
}: {
    texts: Texts;
    data: Params;
}) {
    const decoratorUtils = DecoratorUtils({
        texts,
        breadcrumbs,
        availableLanguages,
        utilsBackground,
    });

    return simple || simpleHeader
        ? SimpleHeader({
              texts,
              decoratorUtils,
          })
        : ComplexHeader({
              texts,
              contextLinks: makeContextLinks(env.XP_BASE_URL),
              context,
              language,
              decoratorUtils,
          });
}

export async function renderFooter({
    features,
    texts,
    data,
    contentService,
}: {
    data: Params;
    texts: Texts;
    features: Features;
    contentService: ContentService;
}) {
    return Footer({
        ...(data.simple || data.simpleFooter
            ? {
                  simple: true,
                  links: await contentService.getSimpleFooterLinks({
                      language: data.language,
                  }),
              }
            : {
                  simple: false,
                  links: await contentService.getComplexFooterLinks({
                      language: data.language,
                      context: data.context,
                  }),
              }),
        data,
        features,
        texts,
    });
}
