import {
    amplitudeEvent,
    initAmplitude,
    logAmplitudeEvent,
    stopAmplitude,
} from "./amplitude";
import { createUmamiEvent, initUmami, logUmamiEvent, stopUmami } from "./umami";
import { initTaskAnalytics, stopTaskAnalytics } from "./task-analytics/ta";
import { Auth } from "decorator-shared/auth";
import { AnalyticsEventArgs, EventData } from "./types";
import { param } from "../params";

declare global {
    interface Window {
        dekoratorenAnalytics: typeof logAnalyticsEventFromApp;
    }
}

const logPageViewCallback = (auth: Auth) => () => logPageView(auth);

export const mockAmplitude = () =>
    Promise.resolve("Amplitude is disabled and mocked due to missing consent.");

export const initAnalytics = (auth: Auth) => {
    initAmplitude();
    initUmami();
    // This function is exposed for use from consuming applications
    window.dekoratorenAnalytics = logAnalyticsEventFromApp;
    initTaskAnalytics();
    logPageView(auth);

    // Pass the callback as a function reference
    window.addEventListener("historyPush", logPageViewCallback(auth));
};

export const stopAnalytics = (auth: Auth) => {
    stopAmplitude();
    stopUmami();
    stopTaskAnalytics();

    window.dekoratorenAmplitude = mockAmplitude;

    // Pass the same function reference
    window.removeEventListener("historyPush", logPageViewCallback(auth));
};

export const buildLocationString = () => {
    const { origin, pathname, hash } = window.location;
    return `${origin}${pathname}${hash}`;
};

const logPageView = (authState: Auth) => {
    // Må vente litt med logging for å sikre at window-objektet er oppdatert.
    setTimeout(() => {
        const params = window.__DECORATOR_DATA__.params;
        const eventData = {
            målgruppe: params.context,
            innholdstype: params.pageType,
            sidetittel: document.title,
            innlogging: authState.authenticated
                ? authState.securityLevel
                : false,
            parametre: {
                ...params,
                BREADCRUMBS:
                    params.breadcrumbs && params.breadcrumbs.length > 0,
                ...(params.availableLanguages && {
                    availableLanguages: params.availableLanguages.map(
                        (lang) => lang.locale,
                    ),
                }),
            },
        };
        logAmplitudeEvent("besøk", eventData);
        logUmamiEvent("besøk", eventData);
    }, 100);
};

export const analyticsEvent = (props: AnalyticsEventArgs) => {
    amplitudeEvent(props);
    createUmamiEvent(props);
};

export const logAnalyticsEvent = async (
    eventName: string,
    eventData: EventData = {},
    origin = "nav-dekoratoren",
) => {
    logAmplitudeEvent(eventName, eventData, origin);
    logUmamiEvent(eventName, eventData, origin);
};

export const analyticsClickListener =
    (fn: (el: HTMLAnchorElement) => AnalyticsEventArgs | null) =>
    (e: MouseEvent) => {
        const anchor =
            e.target instanceof Element ? e.target.closest("a") : null;
        if (anchor) {
            const args = fn(anchor);
            if (args) {
                const analyticsEvent = {
                    context: param("context"),
                    pageType: param("pageType"),
                    tema: param("pageTheme"),
                    destinasjon: anchor.href,
                    kategori: args.kategori,
                    lenkegruppe: args.lenkegruppe,
                    lenketekst: args.lenketekst,
                    komponent: args.komponent,
                };
                amplitudeEvent(analyticsEvent);
                createUmamiEvent(analyticsEvent);
            }
        }
    };

const logAnalyticsEventFromApp = (params?: {
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

        return logAnalyticsEvent(eventName, eventData, origin);
    } catch (e) {
        return Promise.reject(`Unexpected Amplitude error: ${e}`);
    }
};
