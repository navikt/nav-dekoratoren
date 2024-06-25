import { makeContextLinks } from "decorator-shared/context";
import { Params } from "decorator-shared/params";
import { Features, Texts } from "decorator-shared/types";
import { clientEnv, env } from "./env/server";
import { getComplexFooterLinks, getSimpleFooterLinks } from "./menu/main-menu";
import { getFeatures } from "./unleash";
import { Index } from "./views";
import { DecoratorData } from "./views/decorator-data";
import { DecoratorUtils } from "./views/decorator-utils";
import { Footer } from "./views/footer/footer";
import { ComplexHeader } from "./views/header/complex-header";
import { SimpleHeader } from "./views/header/simple-header";
import { getSplashPage } from "./views/splash-page";

export default async ({
    data,
    texts,
    url,
}: {
    data: Params;
    texts: Texts;
    url: string;
}) => {
    const { language } = data;
    const features = getFeatures();

    return Index({
        language,
        header: renderHeader({
            data,
        }),
        footer: await renderFooter({
            data,
            features,
        }),
        decoratorData: DecoratorData({
            texts,
            params: data,
            features,
            environment: clientEnv,
        }),
        main: getSplashPage(url),
    }).render(data);
};

export function renderHeader({
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
    data: Params;
}) {
    const decoratorUtils = DecoratorUtils({
        breadcrumbs,
        availableLanguages,
        utilsBackground,
    });

    return simple || simpleHeader
        ? SimpleHeader({
              decoratorUtils,
          })
        : ComplexHeader({
              contextLinks: makeContextLinks(env.XP_BASE_URL),
              context,
              language,
              decoratorUtils,
          });
}

export async function renderFooter({
    features,
    data,
}: {
    data: Params;
    features: Features;
}) {
    return Footer({
        ...(data.simple || data.simpleFooter
            ? {
                  simple: true,
                  links: await getSimpleFooterLinks({
                      language: data.language,
                  }),
              }
            : {
                  simple: false,
                  links: await getComplexFooterLinks({
                      language: data.language,
                      context: data.context,
                  }),
              }),
        data,
        features,
    });
}
