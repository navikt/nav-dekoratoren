import { Params } from "decorator-shared/params";
import { Texts } from "decorator-shared/types";
import { clientEnv } from "./env/server";
import { getFeatures } from "./unleash";
import { Index } from "./views";
import { DecoratorData } from "./views/decorator-data";
import { getSplashPage } from "./views/splash-page";
import { Header } from "./views/header/header";
import { Footer } from "./views/footer/footer";

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
        header: Header({
            params: data,
        }),
        footer: await Footer({
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
