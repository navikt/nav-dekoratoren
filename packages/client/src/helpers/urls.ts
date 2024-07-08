import { Params } from "decorator-shared/params";
import { formatParams } from "decorator-shared/json";
import { env } from "../params";
import { VERSION_ID_HEADER } from "decorator-shared/constants";

export const endpointUrlWithParams = (
    endpointUrl: `/${string}`,
    params?: Partial<Params> & Record<string, unknown>,
) => {
    const formattedParams = formatParams({
        ...window.__DECORATOR_DATA__.params,
        ...params,
    });

    return `${env("APP_URL")}${endpointUrl}?${formattedParams}&${VERSION_ID_HEADER}=${env("VERSION_ID")}`;
};

export const cdnUrl = (url: string) => `${env("CDN_URL")}${url}`;
