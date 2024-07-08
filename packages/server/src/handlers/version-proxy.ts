import { HonoRequest, MiddlewareHandler } from "hono";
import { VERSION_ID_PARAM } from "decorator-shared/constants";

const SERVER_VERSION_ID = process.env.VERSION_ID as string;
const APP_NAME = process.env.APP_NAME;
const LOOPBACK_HEADER = "x-is-proxy-req";

// Temporarily used to handle requests from previous versions, which did not submit the version-id param
// Can be removed once the "lastversion" instance no longer receives requests
const VERSION_ID_TEMP_FALLBACK = "lastversion";

const fetchFromOtherVersion = async (
    request: HonoRequest,
    targetVersionId: string,
) => {
    const urlObj = new URL(request.url);
    urlObj.protocol = "http:";
    urlObj.host = `${APP_NAME}-${targetVersionId}`;

    const url = urlObj.toString();

    console.log(`Attemping to proxy request to ${url}`);

    try {
        const response = await fetch(url, {
            method: request.method,
            headers: { ...request.raw.headers, [LOOPBACK_HEADER]: "true" },
            body: request.raw.body,
        });

        response.headers.delete("content-encoding");

        return new Response(response.body, response);
    } catch (e) {
        console.log(`Request failed for ${url}`, e);
        return null;
    }
};

export const versionProxyHandler: MiddlewareHandler = async (c, next) => {
    const reqVersionId = c.req.query(VERSION_ID_PARAM);

    // Prevent request loops. Shouldn't happen, but just in case. :)
    const isLoopback = c.req.header(LOOPBACK_HEADER);
    if (isLoopback) {
        console.error(`Loopback for request to version id ${reqVersionId}!`);
    }

    const isClientRequest = !!c.req.header("referer");

    if (
        reqVersionId === SERVER_VERSION_ID ||
        isLoopback ||
        // Requests from clients should be proxied to the fallback instance for now (see comment above)
        (!reqVersionId && !isClientRequest)
    ) {
        return next();
    }

    console.log(
        `Version id did not match this server version - got ${reqVersionId}, expected ${SERVER_VERSION_ID}`,
    );

    const response = await fetchFromOtherVersion(
        c.req,
        reqVersionId || VERSION_ID_TEMP_FALLBACK,
    );

    return response || next();
};
