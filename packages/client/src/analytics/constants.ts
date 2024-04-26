// Split this up to avoid amplitude being pulled in when using these

import { Context } from "decorator-shared/params";

export type AnalyticsCategory =
    | "dekorator-header"
    | "dekorator-footer"
    | "dekorator-meny"
    | "varsler";

export type AnalyticsActions =
    | "søk-dynamisk"
    | "navlogo"
    | "lenke"
    | "lenkegruppe"
    | "hovedmeny/forsidelenke"
    | "[redacted]"
    | "nav.no"
    | "arbeidsflate-valg"
    | `${string}/${string}`;

// type AnalyticsEvent = [string, Partial<AnalyticsEventArgs>];
// type AnalyticsEvents = Record<string, AnalyticsEvent>;

export const analyticsEvents = {
    arkivertBeskjed: [
        "arkivert-beskjed",
        {
            komponent: "varsler-beskjed-arkiverbar",
            category: "varsler" satisfies AnalyticsCategory,
        },
    ],
} as const;

export type Lenkegruppe = "innlogget meny";

export type AnalyticsEventArgs = {
    eventName?: string;
    category: AnalyticsCategory;
    action: AnalyticsActions;
    context?: Context;
    destination?: string;
    label?: string;
    komponent?: string;
    lenkegruppe?: Lenkegruppe;
};
