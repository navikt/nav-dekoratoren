import { Params } from "decorator-shared/params";
import { AnalyticsEventArgs } from "./constants";
import { Auth } from "decorator-shared/auth";

// Dynamic import for lazy loading
const importAmplitude = () =>
    import("@amplitude/analytics-browser").then((module) => module.default);

type EventData = Record<string, any>;

declare global {
    interface Window {
        dekoratorenAmplitude: typeof logEventFromApp;
    }
}

const buildPlatformField = () => {
    const { origin, pathname, hash } = window.location;
    return `${origin}${pathname}${hash}`;
};

export const initAmplitude = async () => {
    const amplitude = await importAmplitude();

    const identify = new amplitude.Identify();
    identify
        .set("skjermbredde", window.screen.width)
        .set("skjermhoyde", window.screen.height)
        .set("vindusbredde", window.innerWidth)
        .set("vindushoyde", window.innerHeight);

    amplitude.identify(identify);
    amplitude.init("default", "", {
        serverUrl: "amplitude.nav.no/collect-auto",
    });

    // This function is exposed for use from consuming applications
    window.dekoratorenAmplitude = logEventFromApp;
};

export const amplitudeEvent = (props: AnalyticsEventArgs) => {
    const {
        context,
        eventName,
        destination,
        category,
        action,
        label,
        komponent,
        lenkegruppe,
    } = props;
    const actionFinal = `${context ? context + "/" : ""}${action}`;

    logAmplitudeEvent(
        eventName || "navigere",
        {
            destinasjon: destination || label,
            søkeord: eventName === "søk" ? "[redacted]" : undefined,
            lenketekst: actionFinal,
            kategori: category,
            komponent: komponent || action,
            lenkegruppe,
        },
        "decorator_next",
    );
};

const logEventFromApp = (params?: {
    origin: unknown | string;
    eventName: unknown | string;
    eventData?: unknown | EventData;
}): Promise<any> => {
    try {
        if (!params || params.constructor !== Object) {
            return Promise.reject(
                "Argument must be an object of type {origin: string, eventName: string, eventData?: Record<string, any>}",
            );
        }

        const { origin, eventName, eventData = {} } = params;
        if (!eventName || typeof eventName !== "string") {
            return Promise.reject('Parameter "eventName" must be a string');
        }
        if (!origin || typeof origin !== "string") {
            return Promise.reject('Parameter "origin" must be a string');
        }
        if (!eventData || eventData.constructor !== Object) {
            return Promise.reject(
                'Parameter "eventData" must be a plain object',
            );
        }

        return logAmplitudeEvent(eventName, eventData, origin);
    } catch (e) {
        return Promise.reject(`Unexpected Amplitude error: ${e}`);
    }
};

export const logPageView = (params: Params, authState: Auth) => {
    return logAmplitudeEvent("besøk", {
        sidetittel: document.title,
        innlogging: authState.authenticated ? authState.securityLevel : false,
        parametre: {
            ...params,
            BREADCRUMBS: params.breadcrumbs && params.breadcrumbs.length > 0,
            ...(params.availableLanguages && {
                availableLanguages: params.availableLanguages.map(
                    (lang) => lang.locale,
                ),
            }),
        },
    });
};

export const logAmplitudeEvent = async (
    eventName: string,
    eventData: EventData = {},
    origin = "decorator-next",
) => {
    const amplitude = await importAmplitude();

    return amplitude.logEvent(eventName, {
        ...eventData,
        platform: buildPlatformField(),
        origin,
        originVersion: eventData.originVersion || "unknown",
        viaDekoratoren: true,
        fromNext: true,
    });
};
