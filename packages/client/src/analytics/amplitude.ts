import { Auth } from "decorator-shared/auth";
import { ClientParams, Context } from "decorator-shared/params";
import { param } from "../params";

// Dynamic import for lazy loading
const importAmplitude = () => import("@amplitude/analytics-browser");

type EventData = Record<string, any>;

export type AmplitudeKategori =
    | "dekorator-header"
    | "dekorator-footer"
    | "dekorator-meny"
    | "dekorator-varsler"
    | "dekorator-driftsmeldinger"
    | "dekorator-brodsmuler"
    | "dekorator-sprakvelger";

type AnalyticsEventArgs = {
    eventName: string;
    context?: Context;
    kategori?: AmplitudeKategori;
    destinasjon?: string;
    lenketekst?: string;
    lenkegruppe?: string;
    komponent?: string;
};

declare global {
    interface Window {
        dekoratorenAmplitude: typeof logEventFromApp;
    }
}

const API_KEYS = {
    Prod: "10798841ebeba333b8ece6c046322d76",
    Dev: "b0ea5ed50acc6bdf505e3f6cdf76b99d",
    Local: "119ddb1e1aa52564d90038ac65926a7d",
    Other: "c1c2553d689ba4716c7d7c4410b521f5",
} as const;

const getApiKey = () => {
    const { hostname } = window.location;
    if (hostname.endsWith(".nav.no")) {
        return hostname.endsWith(".dev.nav.no") ? API_KEYS.Dev : API_KEYS.Prod;
    }
    if (hostname === "localhost") {
        return API_KEYS.Local;
    }
    return API_KEYS.Other;
};

const buildLocationString = () => {
    const { origin, pathname, hash } = window.location;
    return `${origin}${pathname}${hash}`;
};

export const initAmplitude = async () => {
    const amplitude = await importAmplitude();

    amplitude.identify(
        new amplitude.Identify()
            .set("skjermbredde", window.screen.width)
            .set("skjermhoyde", window.screen.height)
            .set("vindusbredde", window.innerWidth)
            .set("vindushoyde", window.innerHeight),
    );

    amplitude.init(getApiKey(), undefined, {
        serverUrl: "https://amplitude.nav.no/collect",
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
        eventName,
        context,
        kategori,
        destinasjon,
        lenketekst,
        lenkegruppe,
        komponent,
    } = props;

    return logAmplitudeEvent(eventName, {
        // context brukes i grensesnittet til dekoratøren, målgruppe er begrepet som brukes internt
        målgruppe: context,
        destinasjon,
        kategori,
        søkeord: eventName === "søk" ? "[redacted]" : undefined,
        lenketekst: eventName === "navigere" ? lenketekst : undefined,
        tekst: eventName !== "navigere" ? lenketekst : undefined,
        lenkegruppe,
        komponent,
    });
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
        målgruppe: window.__DECORATOR_DATA__.params.context,
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
    origin = "nav-dekoratoren",
) => {
    // Always build the url for the source_name field as early as possible.
    // The dynamic import seems to always take at least one tick
    // and the url may have changed in SPAs at that time
    const source_name = buildLocationString();
    const amplitude = await importAmplitude();

    return amplitude.track(
        eventName,
        {
            ...eventData,
            // This field was set for use in the old amplitude-proxy
            // In the current proxy version, source_name serves the same purpose
            // Many teams still use the platform field for continuous data series
            platform: source_name,
            origin,
            originVersion: eventData.originVersion || "unknown",
            viaDekoratoren: true,
        },
        {
            ingestion_metadata: {
                source_name,
            },
        },
    );
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
                    eventName: "navigere",
                    context: param("context"),
                    destinasjon: anchor.href,
                    kategori: args.kategori,
                    lenkegruppe: args.lenkegruppe,
                    lenketekst: args.lenketekst,
                    komponent: args.komponent,
                });
            }
        }
    };
