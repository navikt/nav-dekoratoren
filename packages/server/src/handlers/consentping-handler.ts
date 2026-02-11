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
            name: "consentping",
            hostname: "www.nav.no",
            title: "consentping",
            website: process.env.UMAMI_WEBSITE_ID,
            data: {
                consentObject,
            },
        },
    };

    const umamiEndpoint = `${process.env.UMAMI_PROXY_HOST}/api/send`;

    try {
        await fetch(umamiEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(umamiEvent),
        });
        logger.info("Sent consentping to Umami");
    } catch (error) {
        logger.error("Failed to send consentping:", { error });
        return json({});
    }

    return json({});
};
