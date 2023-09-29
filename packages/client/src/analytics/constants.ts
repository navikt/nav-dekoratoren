// Split this up to avoid amplitude being pulled in when using these

import { MenuValue } from 'decorator-shared/types';

export enum AnalyticsCategory {
  Header = 'dekorator-header',
  Footer = 'dekorator-footer',
  Meny = 'dekorator-meny',
}

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
