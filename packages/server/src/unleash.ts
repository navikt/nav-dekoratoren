import { Unleash, initialize } from "unleash-client";
import { env } from "./env/server";

let unleash: Unleash;
if (env.NODE_ENV === "production") {
    unleash = initialize({
        url: `${env.UNLEASH_SERVER_API_URL}/api/`,
        appName: "nav-dekoratoren",
        customHeaders: { Authorization: env.UNLEASH_SERVER_API_TOKEN },
    });
}

const defaultFeatures = {
    "dekoratoren.skjermdeling": true,
    "dekoratoren.chatbotscript": true,
};

export const getFeatures = () => {
    if (unleash?.isSynchronized()) {
        return {
            "dekoratoren.skjermdeling": unleash.isEnabled(
                "dekoratoren.skjermdeling",
            ),
            "dekoratoren.chatbotscript": unleash.isEnabled(
                "dekoratoren.chatbotscript",
            ),
        };
    }

    return defaultFeatures;
};
