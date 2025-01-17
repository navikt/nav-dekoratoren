import {
    amplitudeEvent,
    initAmplitude,
    logAmplitudeEvent,
    logPageView,
} from "./amplitude";
import {
    createUmamiEvent,
    logPageView as logPageViewUmami,
    logUmamiEvent,
} from "./umami";
import { initTaskAnalytics } from "./task-analytics/ta";
import { Auth } from "decorator-shared/auth";
import { AnalyticsEventArgs, EventData } from "./types";
import { param } from "../params";

export const initAnalytics = (auth: Auth) => {
    initAmplitude();
    initTaskAnalytics();

    logPageView(auth);
    logPageViewUmami();

    window.addEventListener("historyPush", () => logPageView(auth));
    window.addEventListener("historyPush", () => logPageViewUmami());
};

export const buildLocationString = () => {
    const { origin, pathname, hash } = window.location;
    return `${origin}${pathname}${hash}`;
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
