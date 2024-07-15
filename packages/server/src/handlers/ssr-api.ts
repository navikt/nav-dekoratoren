import { validParams } from "../validateParams";
import { getFeatures } from "../unleash";
import { HeaderTemplate } from "../views/header/header";
import { FooterTemplate } from "../views/footer/footer";
import { ScriptsTemplate } from "../views/scripts";
import { StylesTemplate } from "../views/styles";
import { HeadAssetsTemplate } from "../head";
import { env } from "../env/server";
import { Handler, HonoRequest } from "hono";

type ServerStatus = {
    versionId: string;
    deployTs: number;
};

type SsrPayload = {
    data?: {
        header: string;
        footer: string;
        scripts: string;
        styles: string;
        headAssets: string;
    };
    status: ServerStatus;
};

const serverStatus: ServerStatus = {
    versionId: env.VERSION_ID,
    deployTs: Number(env.DEPLOY_TS),
};

const shouldRender = (req: HonoRequest) => {
    const { currentVersionId, currentDeployTs } = req.query();
    if (!currentVersionId || !currentDeployTs) {
        return true;
    }

    return (
        currentVersionId !== serverStatus.versionId &&
        Number(currentDeployTs) < serverStatus.deployTs
    );
};

export const ssrApiHandler: Handler = async ({ req, json }) => {
    if (!shouldRender(req)) {
        return json({ status: serverStatus });
    }

    const params = validParams(req.query());
    const features = getFeatures();

    return json({
        data: {
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
        },
        status: serverStatus,
    } satisfies SsrPayload);
};
