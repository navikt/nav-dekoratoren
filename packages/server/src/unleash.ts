import { Unleash, initialize } from "unleash-client";
import { serverEnv } from "./env/server";
import { isLocalhost } from "./urls";

let unleash: Unleash;
if (serverEnv.NODE_ENV === "production" && !isLocalhost()) {
    unleash = initialize({
        url: `${serverEnv.UNLEASH_SERVER_API_URL}/api/`,
        appName: "nav-dekoratoren",
        customHeaders: { Authorization: serverEnv.UNLEASH_SERVER_API_TOKEN },
    });
}

const defaultFeatures = {
    "dekoratoren.skjermdeling": true,
    "dekoratoren.chatbotscript": true,
    "dekoratoren.umami": true,
    "dekoratoren.puzzel-script": false,
};

// TODO: Features should be loaded on the client to avoid caching.
export const getFeatures = () => {
    if (unleash?.isSynchronized()) {
        return {
            "dekoratoren.skjermdeling": unleash.isEnabled(
                "dekoratoren.skjermdeling",
            ),
            "dekoratoren.chatbotscript": unleash.isEnabled(
                "dekoratoren.chatbotscript",
            ),
            "dekoratoren.umami": unleash.isEnabled("dekoratoren.umami"),
            "dekoratoren.puzzel-script": unleash.isEnabled(
                "dekoratoren.puzzel-script",
            ),
        };
    }

    return defaultFeatures;
};
