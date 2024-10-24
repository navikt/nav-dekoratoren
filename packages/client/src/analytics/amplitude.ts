import { Auth } from "decorator-shared/auth";
import { ClientParams, Context } from "decorator-shared/params";
import { param } from "../params";

// Dynamic import for lazy loading
const importAmplitude = () => import("@amplitude/analytics-browser");

type EventData = Record<string, any>;

type AnalyticsCategory =
    | "dekorator-header"
    | "dekorator-footer"
    | "dekorator-meny"
    | "varsler";

type AnalyticsActions =
    | "søk-dynamisk"
    | "navlogo"
    | "lenke"
    | "lenkegruppe"
    | "hovedmeny/forsidelenke"
    | "[redacted]"
    | "nav.no"
    | "arbeidsflate-valg"
    | `${string}/${string}`
    | string;

type AnalyticsEventArgs = {
    eventName?: string;
    category?: AnalyticsCategory;
    action?: AnalyticsActions;
    context?: Context;
    destination?: string;
    label?: string;
    komponent?: string;
    lenkegruppe?: "innlogget meny";
};

declare global {
    interface Window {
        dekoratorenAmplitude: typeof logEventFromApp;
    }
}

const buildLocationString = () => {
    const { origin, pathname, hash } = window.location;
    return `${origin}${pathname}${hash}`;
};

export const initAmplitude = async () => {
    const amplitude = await importAmplitude();

    const identify = new amplitude.Identify()
        .set("skjermbredde", window.screen.width)
        .set("skjermhoyde", window.screen.height)
        .set("vindusbredde", window.innerWidth)
        .set("vindushoyde", window.innerHeight);

    amplitude.identify(identify);

    amplitude.init("default", undefined, {
        serverUrl: "https://amplitude.nav.no/collect-auto",
        ingestionMetadata: {
            sourceName: buildLocationString(),
        },
        autocapture: {
            attribution: true,
            fileDownloads: false,
            formInteractions: false,
            pageViews: false,
            sessions: true,
            elementInteractions: false,
        },
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

    return logAmplitudeEvent(
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

export const logPageView = (params: ClientParams, authState: Auth) => {
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
    // Always build the url for the platform field as early as possible.
    // The dynamic import seems to always take at least one tick
    // and the url may be wrong at that time
    const platform = buildLocationString();
    const amplitude = await importAmplitude();

    return amplitude.track(eventName, {
        ...eventData,
        platform,
        origin,
        originVersion: eventData.originVersion || "unknown",
        viaDekoratoren: true,
    });
};

export const amplitudeClickListener =
    (fn: (el: HTMLAnchorElement) => AnalyticsEventArgs | null) =>
    (e: MouseEvent) => {
        const anchor =
            e.target instanceof Element ? e.target.closest("a") : null;
        if (anchor) {
            const args = fn(anchor);
            if (args) {
                amplitudeEvent({
                    context: param("context"),
                    label: anchor.href,
                    ...args,
                });
            }
        }
    };
