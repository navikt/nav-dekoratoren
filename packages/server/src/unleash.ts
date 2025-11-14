import { Unleash, initialize } from "unleash-client";
import { randomUUID } from "node:crypto";
import { env } from "./env/server";
import { isLocalhost } from "./urls";

const COOKIE_NAME = "unleash-session-id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds

let unleash: Unleash;
if (env.NODE_ENV === "production" && !isLocalhost()) {
    unleash = initialize({
        url: `${env.UNLEASH_SERVER_API_URL}/api/`,
        appName: "nav-dekoratoren",
        customHeaders: { Authorization: env.UNLEASH_SERVER_API_TOKEN },
    });
}

type SessionIdResult = {
    sessionId: string;
    setCookieHeader: string | null;
};

export const getOrCreateSessionId = (
    cookiesHeader: string,
): SessionIdResult => {
    const match = cookiesHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
    const existingSessionId = match?.[1];

    if (existingSessionId) {
        return {
            sessionId: existingSessionId,
            setCookieHeader: null,
        };
    }

    const newSessionId = randomUUID();
    const cookieValue = `${COOKIE_NAME}=${newSessionId}; Path=/; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; SameSite=Lax`;

    return {
        sessionId: newSessionId,
        setCookieHeader: cookieValue,
    };
};

const defaultFeatures = {
    "dekoratoren.skjermdeling": true,
    "dekoratoren.chatbotscript": true,
    "dekoratoren.umami": true,
    "dekoratoren.puzzel-script": false,
    "use-legacy-navigation": true,
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
            "use-legacy-navigation": defaultFeatures["use-legacy-navigation"],
        };
    }

    return defaultFeatures;
};

const getFeaturesForSession = (sessionId: string) => {
    if (unleash?.isSynchronized()) {
        const context = { sessionId };
        const features = getFeatures();
        return {
            ...features,
            "use-legacy-navigation": unleash.isEnabled(
                "use-legacy-navigation",
                context,
            ),
        };
    }

    return defaultFeatures;
};

type FeaturesWithSession = {
    features: ReturnType<typeof getFeatures>;
    sessionId: string;
    setCookieHeader: string | null;
};

export const getFeaturesWithSession = (
    cookiesHeader: string = "",
): FeaturesWithSession => {
    const { sessionId, setCookieHeader } = getOrCreateSessionId(cookiesHeader);

    return {
        features: getFeaturesForSession(sessionId),
        sessionId,
        setCookieHeader,
    };
};
