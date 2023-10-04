// Split this up to avoid amplitude being pulled in when using these

import { MenuValue } from 'decorator-shared/types';

export enum AnalyticsCategory {
  Header = 'dekorator-header',
  Footer = 'dekorator-footer',
  Meny = 'dekorator-meny',
  Varsler = 'varsler',
}

// type AnalyticsEvent = [string, Partial<AnalyticsEventArgs>];
// type AnalyticsEvents = Record<string, AnalyticsEvent>;

export const analyticsEvents = {
  akrivertBeskjed: [
    'arkivert-beskjed',
    {
      komponent: 'varsler-beskjed-arkiverbar',
      category: AnalyticsCategory.Varsler,
    },
  ],
} as const;

export type AnalyticsEventArgs = {
  eventName?: string;
  category: AnalyticsCategory;
  action: string;
  context?: MenuValue;
  destination?: string;
  label?: string;
  komponent?: string;
  lenkegruppe?: string;
};
