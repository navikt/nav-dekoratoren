import { makeContextLinks } from "decorator-shared/context";
import { Params } from "decorator-shared/params";
import ContentService from "./content-service";
import { clientEnv, env } from "./env/server";
import { texts } from "./texts";
import { GetFeatures } from "./unleash-service";
import { Index } from "./views";
import { DecoratorData } from "./views/decorator-data";
import { DecoratorUtils } from "./views/decorator-utils";
import { ComplexHeader } from "./views/header/complex-header";
import { SimpleHeader } from "./views/header/simple-header";
import { getSplashPage } from "./views/splash-page";
import { Footer } from "./views/footer/footer";
import { isExternallyAvailable } from "decorator-shared/utils";
import { Features, Texts } from "decorator-shared/types";

export default async ({
    contentService,
    unleashService,
    data,
    url: origin,
}: {
    contentService: ContentService;
    unleashService: GetFeatures;
    data: Params;
    url: string;
    query: Record<string, unknown>;
}) => {
    const { language } = data;
    const localTexts = texts[language];

    const features = unleashService.getFeatures();

    const sharedArgs = {
        texts: localTexts,
        data,
        contentService,
    };

    return Index({
        language,
        header: await renderHeader(sharedArgs),
        footer: await renderFooter({
            ...sharedArgs,
            features,
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

// Maybe find a better place for this later. The concept i'm trying to communicate here are the logical switchgates for which version of the view to render. Where the logical is encapsulated in the function.
type SharedParameters = {
    contentService: ContentService;
    data: Params;
    texts: Texts;
};

export async function renderHeader({
    texts,
    data,
    contentService,
}: SharedParameters) {
    const decoratorUtils = DecoratorUtils({
        breadcrumbs: data.breadcrumbs,
        availableLanguages: data.availableLanguages,
        utilsBackground: data.utilsBackground,
        hidden: isExternallyAvailable(clientEnv.APP_URL),
        localTexts: texts,
    });

    return data.simple || data.simpleHeader
        ? SimpleHeader({
              texts,
              decoratorUtils,
          })
        : ComplexHeader({
              texts,
              contextLinks: makeContextLinks(env.XP_BASE_URL),
              context: data.context,
              language: data.language,
              decoratorUtils,
              opsMessages: data.ssr
                  ? await contentService.getOpsMessages()
                  : [],
          });
}

export async function renderFooter({
    features,
    texts,
    data,
    contentService,
}: SharedParameters & {
    features: Features;
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
