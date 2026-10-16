import { Context } from 'decorator-shared/params';

export type AnalyticsKategori =
	| 'dekorator-header'
	| 'dekorator-footer'
	| 'dekorator-meny'
	| 'dekorator-varsler'
	| 'dekorator-driftsmeldinger'
	| 'dekorator-brodsmuler'
	| 'dekorator-sprakvelger';

export type AnalyticsEventArgs = {
	eventName?: string;
	context?: Context;
	pageType?: string;
	pageTheme?: string;
	kategori?: AnalyticsKategori;
	destinasjon?: string;
	tekst?: string;
	lenketekst?: string;
	lenkegruppe?: string;
	komponent?: string;
	sokeord?: string;
	treffnr?: number;
};

export type EventData = Record<string, any>;
