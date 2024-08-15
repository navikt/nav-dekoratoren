import { validParams } from "../validateParams";
import { getFeatures } from "../unleash";
import { HeaderTemplate } from "../views/header/header";
import { FooterTemplate } from "../views/footer/footer";
import { ScriptsTemplate } from "../views/scripts";
import { StylesTemplate } from "../views/styles";
import { HeadAssetsTemplate } from "../head";
import { Handler } from "hono";
import { env } from "../env/server";

type SsrPayload = {
    header: string;
    footer: string;
    scripts: string;
    styles: string;
    headAssets: string;
    versionId: string;
};

export const ssrApiHandler: Handler = async ({ req, json }) => {
    const params = validParams(req.query());
    const features = getFeatures();

    return json({
        header: (
            await HeaderTemplate({
                params,
                withContainers: true,
            })
        ).render(params),
        footer: (
            await FooterTemplate({
                params,
                features,
                withContainers: true,
            })
        ).render(params),
        scripts: ScriptsTemplate({ features, params }).render(params),
        styles: StylesTemplate().render(),
        headAssets: HeadAssetsTemplate().render(),
        versionId: env.VERSION_ID,
    } satisfies SsrPayload);
};
