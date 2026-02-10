import { Consent } from "decorator-shared/types";
import { Handler } from "hono";

export const consentpingHandler: Handler = async ({ req, json }) => {
    const body = (await req.json()) as any;
    if (!body?.consentObject) {
        return json({
            result: "error",
            message: "Missing consentObject in request body",
        });
    }

    const { consentObject } = body as { consentObject: Consent };

    const umamiEvent = {
        type: "cookie-consent-event",
        payload: {
            website: process.env.UMAMI_WEBSITE_ID,
            data: {
                consentObject,
            },
        },
    };

    return json({ result: "ok" });
};
