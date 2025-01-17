import { amplitudeEvent, initAmplitude, logAmplitudeEvent } from "./amplitude";
import { createUmamiEvent, logUmamiEvent } from "./umami";
import { initTaskAnalytics } from "./task-analytics/ta";
import { Auth } from "decorator-shared/auth";
import { AnalyticsEventArgs, EventData } from "./types";
import { param } from "../params";

export const initAnalytics = (auth: Auth) => {
    initAmplitude();
    initTaskAnalytics();

    logPageView(auth);

    window.addEventListener("historyPush", () => logPageView(auth));
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

// TODO: Vurder disse to under her, trenger man to forskjellige?
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
