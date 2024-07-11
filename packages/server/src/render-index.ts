import { Params } from "decorator-shared/params";
import { Texts } from "decorator-shared/types";
import { clientEnv } from "./env/server";
import { getFeatures } from "./unleash";
import { Index } from "./views";
import { DecoratorData } from "./views/decorator-data";
import { getSplashPage } from "./views/splash-page";
import { HeaderContainer } from "./views/header/header-container";
import { FooterContainer } from "./views/footer/footer-container";

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
        header: HeaderContainer({
            params: data,
        }),
        footer: await FooterContainer({
            params: data,
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
