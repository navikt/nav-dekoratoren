import { Params } from "decorator-shared/params";
import { getFeatures } from "./unleash";
import { Index } from "./views";
import { getSplashPage } from "./views/splash-page";
import { Header } from "./views/header/header";
import { Footer } from "./views/footer/footer";
import { Scripts } from "./views/scripts";

type Props = {
    params: Params;
    url: string;
};

export default async ({ params, url }: Props) => {
    const { language } = params;
    const features = getFeatures();

    return Index({
        language,
        header: Header({
            params,
            withContainers: true,
        }),
        footer: await Footer({
            params,
            features,
            withContainers: true,
        }),
        scripts: Scripts({
            params,
            features,
        }),
        main: getSplashPage(url),
    }).render(params);
};
