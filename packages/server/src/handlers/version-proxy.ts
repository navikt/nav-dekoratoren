import { HonoRequest, MiddlewareHandler } from "hono";
import { VERSION_ID_PARAM } from "decorator-shared/constants";
import { env } from "../env/server";
import { logger } from "../lib/logger";

const SERVER_VERSION_ID = env.VERSION_ID;
const APP_NAME = env.APP_NAME;
const LOOPBACK_HEADER = "is-dekoratoren-proxy-req";

// Version id should be a commit hash (7 chars short or 40 chars full)
const validVersionIdPattern = new RegExp(/^([a-f0-9]{7}|[a-f0-9]{40})$/);

const isValidVersionId = (versionId?: string): versionId is string =>
    !!(versionId && validVersionIdPattern.test(versionId));

const fetchFromInternalVersionApp = async (
    request: HonoRequest,
    targetVersionId: string,
) => {
    const urlObj = new URL(request.url);
    urlObj.protocol = "http:";
    urlObj.host = `${APP_NAME}-${targetVersionId}`;

    const url = urlObj.toString();

    logger.info(
        `Proxy request to: ${urlObj.host}${urlObj.pathname} - Referer: ${request.header("referer")}`,
    );

    try {
        request.raw.headers.set(LOOPBACK_HEADER, "true");

        const response = await fetch(url, {
            method: request.method,
            headers: request.raw.headers,
            body: request.raw.body,
        });

        // This header won't always match what we actually return in our response and can cause client errors
        response.headers.delete("content-encoding");

        return new Response(response.body, response);
    } catch (e) {
        logger.error(`Proxy request failed for ${url} - ${e}`);
        return null;
    }
};

export const versionProxyHandler: MiddlewareHandler = async (c, next) => {
    const reqVersionId = c.req.query(VERSION_ID_PARAM);

    // Prevent request loops. Shouldn't happen, but it does! :thinking:
    const isLoopback = c.req.header(LOOPBACK_HEADER);
    if (isLoopback) {
        logger.error(`Loopback for request to version id ${reqVersionId}!`);
    }

    if (
        reqVersionId === SERVER_VERSION_ID ||
        isLoopback ||
        !isValidVersionId(reqVersionId)
    ) {
        return next();
    }

    const response = await fetchFromInternalVersionApp(c.req, reqVersionId);

    return response || next();
};
