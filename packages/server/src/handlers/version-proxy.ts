import { HonoRequest, MiddlewareHandler } from "hono";
import { VERSION_ID_HEADER } from "decorator-shared/constants";

const serverBuildId = process.env.VERSION_ID as string;
const appName = process.env.APP_NAME;

const fetchFromBuildVersion = async (request: HonoRequest) => {
    const reqBuildId = request.query(VERSION_ID_HEADER);

    const newUrl = new URL(request.url);
    newUrl.protocol = "http:";
    newUrl.host = `${appName}-${reqBuildId}`;
    newUrl.searchParams.set("is-proxied-req", "true");

    console.log(`New url:`, newUrl.toString());

    try {
        const response = await fetch(newUrl.toString(), {
            method: request.method,
            headers: request.raw.headers,
            body: request.raw.body,
        });

        console.log("Response:", response);
        response.headers.delete("content-encoding");

        return new Response(response.body, response);
    } catch (e) {
        console.log(`Request failed - ${e}`);
        return null;
    }
};

export const versionProxyHandler: MiddlewareHandler = async (c, next) => {
    const reqBuildId = c.req.query(VERSION_ID_HEADER);
    const isProxied = c.req.query("is-proxied-req");

    if (!reqBuildId || reqBuildId === serverBuildId || isProxied) {
        return next();
    }

    console.log(
        `Not my id! Wanted ${serverBuildId} - got ${reqBuildId} - url ${c.req.url}`,
    );

    const response = await fetchFromBuildVersion(c.req);
    if (!response) {
        return next();
    }

    console.log("Returning response ", response);

    return response;
};
