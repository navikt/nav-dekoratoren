import {
    AppState,
    ClientTexts,
    clientTextsKeys,
    Features,
    HtmlElementProps,
} from "decorator-shared/types";
import {
    clientParamKeys,
    ClientParams,
    Params,
    validateRawParams,
} from "decorator-shared/params";

import { clientEnv } from "./env/server";
import { texts } from "./texts";

export type DecoratorDataProps = {
    features: Features;
    params: Params;
    rawParams: Record<string, string>;
    headAssets?: HtmlElementProps[];
};

const getAllowedStorage = (): string[] => {
    return [];
};

export const buildDecoratorData = ({
    features,
    params,
    rawParams,
    headAssets,
}: DecoratorDataProps): AppState => ({
    texts: Object.entries(texts[params.language])
        .filter(([key]) => clientTextsKeys.includes(key as keyof ClientTexts))
        .reduce(
            (prev, [key, value]) => ({
                ...prev,
                [key]: value,
            }),
            {},
        ) as ClientTexts,
    params: Object.entries(params)
        .filter(([key]) => clientParamKeys.includes(key as keyof ClientParams))
        .reduce(
            (prev, [key, value]) => ({
                ...prev,
                [key]: value,
            }),
            {},
        ) as ClientParams,
    rawParams: validateRawParams(rawParams),
    features,
    env: clientEnv,
    headAssets,
    allowedStorage: getAllowedStorage(),
});
