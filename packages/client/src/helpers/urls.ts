import { Params } from "decorator-shared/params";
import { formatParams } from "decorator-shared/json";
import { env } from "../params";
import { VERSION_ID_PARAM } from "decorator-shared/constants";

export const endpointUrlWithParams = (
    endpointUrl: `/${string}`,
    params?: Partial<Params> & Record<string, unknown>,
) => {
    const formattedParams = formatParams({
        ...window.__DECORATOR_DATA__.params,
        ...params,
    });

    return `${env("APP_URL")}${endpointUrl}?${formattedParams}&${VERSION_ID_PARAM}=${env("VERSION_ID")}`;
};

export const cdnUrl = (url: string) => `${env("CDN_URL")}${url}`;

export const parseUrl = (url: string) => {
    try {
        return new URL(url);
    } catch (e) {
        return null;
    }
};
