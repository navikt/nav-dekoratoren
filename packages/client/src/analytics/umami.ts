import { env } from "../params";
import {
    getCurrentReferrer,
    extraWindowParams,
    buildLocationString,
} from "./analytics";
import { redactFromUrl } from "./helpers/redactUrl";
import { AnalyticsEventArgs, EventData } from "./types";

const UUID_REGEX =
    /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;
const EXEMPT_KEYS = ["website"];

export const redactUuids = (value: any): any => {
    if (value === null || value === undefined) {
        return value;
    }

    if (typeof value === "string") {
        return value.replaceAll(UUID_REGEX, "[redacted: uuid]");
    }

    if (Array.isArray(value)) {
        return value.map(redactUuids);
    }

    if (typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).map(([key, val]) => {
                if (EXEMPT_KEYS.includes(key)) {
                    return [key, val];
                }
                return [key, redactUuids(val)];
            }),
        );
    }

    return value;
};

export const redactQueryString = (url: string): string => {
    if (!url) return url;
    if (!url.includes("?")) return url;

    const [baseUrl] = url.split("?");
    return baseUrl;
};

export const logUmamiEvent = async (
    eventName: string,
    eventData: EventData = {},
    origin = "nav-dekoratoren",
) => {
    if (
        window.__DECORATOR_DATA__.features["dekoratoren.umami"] &&
        typeof umami !== "undefined"
    ) {
        const url = redactFromUrl(
            buildLocationString({
                includeOrigin: false,
                includeHash: false,
            }),
        );

        return umami.track((props) =>
            redactUuids({
                ...props,
                name: eventName === "besøk" ? undefined : eventName,
                url,
                title: window.document.title,
                referrer:
                    eventName === "besøk"
                        ? redactFromUrl(
                              redactQueryString(
                                  getCurrentReferrer() ?? props.referrer,
                              ),
                          )
                        : undefined,
                data: {
                    ...eventData,
                    destinasjon: redactQueryString(eventData.destinasjon),
                    origin,
                    originVersion: eventData.originVersion || "unknown",
                    viaDekoratoren: true,
                    ...extraWindowParams(),
                },
            }),
        );
    }
};

export const createUmamiEvent = (props: AnalyticsEventArgs) => {
    const {
        eventName: optionalEventName,
        context,
        pageType,
        pageTheme,
        ...rest
    } = props;

    const eventName = optionalEventName ?? "navigere";
    return logUmamiEvent(eventName, {
        // context brukes i grensesnittet til dekoratøren, målgruppe er begrepet som brukes internt
        målgruppe: context,
        innholdstype: pageType,
        tema: pageTheme,
        søkeord: eventName === "søk" ? "[redacted: search]" : undefined,
        ...rest,
    });
};

export const initUmami = () => {
    if (window.__DECORATOR_DATA__.features["dekoratoren.umami"]) {
        const script = document.createElement("script");
        script.src = "https://cdn.nav.no/team-researchops/sporing/sporing.js";
        script.defer = true;
        script.setAttribute("data-host-url", "https://umami.nav.no");
        script.setAttribute("data-website-id", `${env("UMAMI_WEBSITE_ID")}`);
        script.setAttribute("data-auto-track", "false");
        document.head.appendChild(script);
    }
};

export const stopUmami = () => {
    const umamiScript = document.querySelector(
        'script[src="https://cdn.nav.no/team-researchops/sporing/sporing.js"]',
    );

    if (umamiScript) {
        umamiScript.remove();
    }
};
