import { Params } from "decorator-shared/params";
import { formatParams } from "decorator-shared/json";
import { env } from "../params";

export const endpointUrlWithParams = (
    endpointUrl: `/${string}`,
    params?: Partial<Params>,
) => {
    const formattedParams = formatParams({
        ...window.__DECORATOR_DATA__.params,
        ...params,
    });

    return `${env("APP_URL")}${endpointUrl}?${formattedParams}`;
};
