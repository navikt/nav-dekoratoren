import { HonoRequest, MiddlewareHandler } from "hono";
import { VERSION_ID_HEADER } from "decorator-shared/constants";

const serverVersionId = process.env.VERSION_ID as string;
const appName = process.env.APP_NAME;

const fetchFromBuildVersion = async (request: HonoRequest) => {
    const reqVersionId = request.query(VERSION_ID_HEADER);

    const urlObj = new URL(request.url);
    urlObj.protocol = "http:";
    urlObj.host = `${appName}-${reqVersionId}`;
    urlObj.searchParams.set("is-proxied-req", "true");

    const url = urlObj.toString();

    console.log(`Trying to fetch response from ${url}`);

    try {
        const response = await fetch(url, {
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
    const reqVersionId = c.req.query(VERSION_ID_HEADER);
    const isProxied = c.req.query("is-proxied-req");

    if (!reqVersionId || reqVersionId === serverVersionId || isProxied) {
        return next();
    }

    console.log(
        `Version id did not match - got ${reqVersionId}, expected ${serverVersionId}`,
    );

    const response = await fetchFromBuildVersion(c.req);
    if (!response) {
        return next();
    }

    return response;
};
