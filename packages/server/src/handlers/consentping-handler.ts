import { logger } from "decorator-shared/logger";
import { Consent } from "decorator-shared/types";
import { Handler } from "hono";

export const consentpingHandler: Handler = async ({ req, json }) => {
    const body = await req.json();

    if (!body?.consentObject) {
        return json({
            result: "error",
            message: "Missing consentObject in request body",
        });
    }

    const { consentObject } = body as { consentObject: Consent };

    const umamiEvent = {
        type: "event",
        payload: {
            name: "cookiebanner",
            hostname: "www.nav.no",
            url: "/",
            referrer: "https://www.nav.no",
            website: process.env.UMAMI_WEBSITE_ID,
            data: {
                consentObject,
            },
        },
    };

    const umamiEndpoint = `${process.env.UMAMI_PROXY_HOST}/api/send`;

    try {
        const umamiResponse = await fetch(umamiEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent":
                    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            },
            body: JSON.stringify(umamiEvent),
        });
        if (!umamiResponse.ok) {
            logger.error("Failed to send consentping:", {
                error: `HTTP ${umamiResponse.status} - ${umamiResponse.statusText}`,
            });
        }
    } catch (error) {
        logger.error("Failed to send consentping:", { error });
        return json({});
    }

    return json({});
};
