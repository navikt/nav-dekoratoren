import {
    initTaskAnalyticsScript,
    stopTaskAnalytics,
} from "./task-analytics/ta";
import { initMockAmplitude } from "./amplitude";
import { createUmamiEvent, initUmami, logUmamiEvent, stopUmami } from "./umami";
import { Auth } from "decorator-shared/auth";
import { AnalyticsEventArgs, EventData } from "./types";
import { param } from "../params";

declare global {
    interface Window {
        dekoratorenAnalytics: typeof logAnalyticsEventFromApp;
    }
}

const logPageViewCallback = (auth: Auth) => () => logPageView(auth);

export const mockAnalytics = () => {
    return Promise.resolve();
};

export const initAnalytics = (auth: Auth) => {
    initMockAmplitude(); // Some teams are calling window.dekoratorenAmplitude directly
    initTaskAnalyticsScript();
    initUmami();

    // This function is exposed for use from consuming applications
    window.dekoratorenAnalytics = logAnalyticsEventFromApp;
    logPageView(auth);

    // Pass the callback as a function reference
    window.addEventListener("historyPush", logPageViewCallback(auth));
};

export const stopAnalytics = (auth: Auth) => {
    stopUmami();
    stopTaskAnalytics();

    // Pass the same function reference
    window.removeEventListener("historyPush", logPageViewCallback(auth));
};

export const buildLocationString = () => {
    const { origin, pathname, hash } = window.location;
    return `${origin}${pathname}${hash}`;
};

// Parametere vi ønsker skal logges for alle apper
export const extraWindowParams = () => {
    return {
        scrollPos: window.scrollY,
        scrollPercent: Math.round(
            Math.min(
                ((window.scrollY + window.innerHeight) /
                    (document.body.scrollHeight + 1)) *
                    100,
                100,
            ),
        ),
    };
};

const logPageView = (authState: Auth) => {
    // Må vente litt med logging for å sikre at window-objektet er oppdatert.
    setTimeout(() => {
        const params = window.__DECORATOR_DATA__.params;
        const eventData = {
            målgruppe: params.context,
            innholdstype: params.pageType,
            sidetittel: params.pageTitle || document.title,
            tema: params.pageTheme,
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
        logUmamiEvent("besøk", eventData);
    }, 100);
};

export const analyticsEvent = (props: AnalyticsEventArgs) => {
    createUmamiEvent(props);
};

export const logAnalyticsEvent = async (
    eventName: string,
    eventData: EventData = {},
    origin = "nav-dekoratoren",
) => {
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
                const analyticsEvent: AnalyticsEventArgs = {
                    context: param("context"),
                    pageType: param("pageType"),
                    pageTheme: param("pageTheme"),
                    destinasjon: anchor.href,
                    kategori: args.kategori,
                    lenkegruppe: args.lenkegruppe,
                    lenketekst: args.lenketekst,
                    tekst: args.tekst,
                    komponent: args.komponent,
                };
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
        return Promise.reject(`Unexpected Analytics error: ${e}`);
    }
};

class AnalyticsTracker {
    private currentReferrer: string;
    private previousUrl: string;
    private isInitialized: boolean = false;

    constructor() {
        this.currentReferrer = document.referrer;
        this.previousUrl = window.location.href;
        this.init();
    }

    private init(): void {
        if (this.isInitialized) return;

        this.bindNavigationEvents();
        this.isInitialized = true;
    }

    private bindNavigationEvents(): void {
        // Handle popstate (back/forward buttons)
        window.addEventListener("popstate", this.handleNavigation.bind(this));

        // Monkey patch history push method to catch programmatic navigation
        const originalPushState = history.pushState;
        history.pushState = (...args) => {
            const result = originalPushState.apply(history, args);
            // Use setTimeout to ensure the URL has changed
            setTimeout(() => this.handleNavigation(), 0);
            return result;
        };
    }

    private handleNavigation(): void {
        const currentUrl = window.location.href;

        // Only update if URL actually changed
        if (currentUrl !== this.previousUrl) {
            this.currentReferrer = this.previousUrl;
            this.previousUrl = currentUrl;
        }
    }

    public getCurrentReferrer(): string {
        return this.currentReferrer;
    }
}

const analyticsTracker = new AnalyticsTracker();

export function getCurrentReferrer(): string {
    return analyticsTracker.getCurrentReferrer();
}
