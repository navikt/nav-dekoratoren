import { Features } from "decorator-shared/types";
import { Unleash, initialize } from "unleash-client";

type Config = {
    mock?: boolean;
};

/**
 * @deprecated Only for testing deployment
 */
export interface GetFeatures {
    getFeatures(): Features;
}

export default class UnleashService {
    unleashInstance: Unleash | null;
    defaultToggles: { [key: string]: boolean };
    mock: boolean;

    constructor({ mock }: Config) {
        // @TODO: Here we should use server/env/schema
        const { UNLEASH_SERVER_API_TOKEN, UNLEASH_SERVER_API_URL } =
            process.env;

        // Important: If the Unleash Next service goes down, we don't want
        // screen sharing or the chatbot to automatically be disabled.
        // However, future toggles may want to default to false, so assign
        // this below:
        this.defaultToggles = {
            "dekoratoren.skjermdeling": true,
            "dekoratoren.chatbotscript": true,
        };
        this.unleashInstance = null;
        this.mock = mock || process.env.ENV === "localhost" || false;

        if (this.mock) {
            return;
        }

        if (!UNLEASH_SERVER_API_TOKEN || !UNLEASH_SERVER_API_URL) {
            console.error(
                "Missing UNLEASH_SERVER_API_TOKEN or UNLEASH_SERVER_API_URL",
            );
            return;
        }

        try {
            console.log("Initializing unleash");
            this.unleashInstance = initialize({
                url: `${UNLEASH_SERVER_API_URL}/api/`,
                appName: "nav-dekoratoren",
                customHeaders: { Authorization: UNLEASH_SERVER_API_TOKEN },
            });
        } catch (e) {
            console.error("Error initializing unleash", e);
        }
    }

    getFeatures(): Features {
        const features = Object.keys(this.defaultToggles).reduce(
            (acc, toggle: string) => {
                // If mocking or running from localhost, return default toggles without
                // actually trying to get anything from Unleash Next
                if (this.mock)
                    return { ...acc, [toggle]: this.defaultToggles[toggle] };

                // If Unleash instance is not synched, return the default toggles
                // to prevent chatbot or screen sharing to be disabled just because Unleash failing.
                const isFeatureEnabled = this.unleashInstance?.isSynchronized()
                    ? this.unleashInstance.isEnabled(toggle)
                    : this.defaultToggles[toggle];
                return { ...acc, [toggle]: isFeatureEnabled };
            },
            {},
        ) as Features;

        return features;
    }
}
