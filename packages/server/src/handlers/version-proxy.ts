import { HonoRequest, MiddlewareHandler } from "hono";
import { VERSION_ID_PARAM } from "decorator-shared/constants";

const SERVER_VERSION_ID = process.env.VERSION_ID as string;
const APP_NAME = process.env.APP_NAME;
const LOOPBACK_HEADER = "x-is-proxy-req";

const pathsToProxy = [
    "/api/search",
    "/main-menu",
    "/auth",
    "/header",
    "/footer",
];

const pathsToProxyOnEmptyVersionId = new Set([
    ...pathsToProxy,
    ...pathsToProxy.map((path) => `/dekoratoren${path}`),
    ...pathsToProxy.map((path) => `/common-html/v4/navno${path}`),
]);

// We temporarily need to handle requests for some paths from previous versions, which does not submit the version-id param
// The "lastversion" instance of the internal server has been deployed for this purpose
// Can be removed once the lastversion instance no longer receives requests
const getVersionId = (req: HonoRequest) => {
    const reqVersionId = req.query(VERSION_ID_PARAM);

    if (!reqVersionId) {
        return pathsToProxyOnEmptyVersionId.has(req.path)
            ? "lastversion"
            : undefined;
    }

    return reqVersionId;
};

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
        const init = {
            method: request.method,
            headers: { ...request.raw.headers, [LOOPBACK_HEADER]: "true" },
            body: request.raw.body,
        };
        console.log(`request to proxy: ${JSON.stringify(request)}`);
        console.log(`init to proxy: ${JSON.stringify(init)}`);
        console.log(
            `Cookie: ${request.header("cookie")} ${request.header("Cookie")}`,
        );

        const response = await fetch(url, init);

        console.log(
            `Response from ${url} - ${response.status} ${response.statusText}`,
            response,
        );

        // This header won't always match what we actually return in our response and can cause client errors
        response.headers.delete("content-encoding");

        return new Response(response.body, response);
    } catch (e) {
        console.error(`Proxy request failed for ${url} - ${e}`);
        return null;
    }
};

export const versionProxyHandler: MiddlewareHandler = async (c, next) => {
    const reqVersionId = getVersionId(c.req);

    // Prevent request loops. Shouldn't happen, but just in case. :)
    const isLoopback = c.req.header(LOOPBACK_HEADER);
    if (isLoopback) {
        console.error(`Loopback for request to version id ${reqVersionId}!`);
    }

    if (reqVersionId === SERVER_VERSION_ID || isLoopback || !reqVersionId) {
        return next();
    }

    console.log(
        `Version id did not match this server version - got ${reqVersionId}, expected ${SERVER_VERSION_ID}`,
    );

    const response = await fetchFromOtherVersion(c.req, reqVersionId);

    return response || next();
};
