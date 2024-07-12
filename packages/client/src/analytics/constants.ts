// Split this up to avoid amplitude being pulled in when using these

import { Context } from "decorator-shared/params";

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

export const analyticsEvents = {
    arkivertBeskjed: [
        "arkivert-beskjed",
        {
            komponent: "varsler-beskjed-arkiverbar",
            category: "varsler" satisfies AnalyticsCategory,
        },
    ],
} as const;

export type AnalyticsEventArgs = {
    eventName?: string;
    category?: AnalyticsCategory;
    action?: AnalyticsActions;
    context?: Context;
    destination?: string;
    label?: string;
    komponent?: string;
    lenkegruppe?: "innlogget meny";
};
