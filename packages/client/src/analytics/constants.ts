// Split this up to avoid amplitude being pulled in when using these

import { MenuValue } from 'decorator-shared/types';

export type AnalyticsCategory =
  | 'dekorator-header'
  | 'dekorator-footer'
  | 'dekorator-meny'
  | 'varsler';

// type AnalyticsEvent = [string, Partial<AnalyticsEventArgs>];
// type AnalyticsEvents = Record<string, AnalyticsEvent>;

export const analyticsEvents = {
  akrivertBeskjed: [
    'arkivert-beskjed',
    {
      komponent: 'varsler-beskjed-arkiverbar',
      category: 'varsler' satisfies AnalyticsCategory,
    },
  ],
} as const;

export type Lenkegruppe = 'innlogget meny';

export type AnalyticsEventArgs = {
  eventName?: string;
  category: AnalyticsCategory;
  action: string;
  context?: MenuValue;
  destination?: string;
  label?: string;
  komponent?: string;
  lenkegruppe?: Lenkegruppe;
};
