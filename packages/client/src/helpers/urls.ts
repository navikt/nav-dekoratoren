import { Params } from "decorator-shared/params";
import { formatParams } from "decorator-shared/json";
import { env } from "../params";

export const endpointUrlWithParams = (
    endpointUrl: `/${string}`,
    params?: Partial<Params> & Record<string, unknown>,
) => {
    const formattedParams = formatParams({
        ...window.__DECORATOR_DATA__.params,
        ...params,
    });

    console.log(`${env("APP_URL")}${endpointUrl}?${formattedParams}`);
    console.log("endpointurl - " + endpointUrl);

    return `${env("APP_URL")}${endpointUrl}?${formattedParams}`;
};
