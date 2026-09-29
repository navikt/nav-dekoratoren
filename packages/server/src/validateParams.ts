import {
	AvailableLanguage,
	modulerEntryPointSchema,
	modulerVersionSemverSchema,
	type Params,
	paramsSchema,
	teamNameSchema,
} from 'decorator-shared/params';
import { match, P } from 'ts-pattern';
import { ZodBoolean, ZodDefault } from 'zod';
import { logger } from './lib/logger';

const booleans = Object.entries(paramsSchema.shape).reduce<string[]>((prev, [key, value]) => {
	if (value instanceof ZodDefault && value._def.innerType instanceof ZodBoolean) {
		return [...prev, key];
	}
	return prev;
}, []);

export const parseBooleanParam = (param?: unknown): boolean =>
	match(param)
		.with(P.string, (param) => param === 'true')
		.with(P.boolean, (param) => param)
		.otherwise(() => false);

export const validateParams = (params: Record<string, string>) => {
	const reduced = booleans.reduce((prev, key) => {
		const exists = params[key] !== undefined;
		const isOptional = !(paramsSchema.shape[key as keyof Params] instanceof ZodDefault);
		const shouldParse = exists || isOptional;

		return {
			...prev,
			[key]: shouldParse ? parseBooleanParam(params[key]) : paramsSchema.shape[key as keyof Params].parse(params[key]),
		};
	}, {});

	// A failing safeParse builds a ZodError, which is several times the cost of a successful parse.
	const modulerVersion =
		params.decoratorModulerVersion === undefined
			? undefined
			: modulerVersionSemverSchema.safeParse(params.decoratorModulerVersion).data;
	const modulerEntryPoint =
		params.decoratorModulerEntryPoint === undefined
			? undefined
			: modulerEntryPointSchema.safeParse(params.decoratorModulerEntryPoint).data;

	return {
		...params,
		...reduced,
		logoutUrl: match(params.logoutUrl)
			.with(P.string, (url) => url)
			.otherwise(() => undefined),
		breadcrumbs: match(params.breadcrumbs)
			.with(P.string, (breadcrumbs) => JSON.parse(breadcrumbs))
			.otherwise(() => []),
		availableLanguages: params.availableLanguages
			? JSON.parse(params.availableLanguages).map((language: AvailableLanguage) => ({
					...language,
					handleInApp: parseBooleanParam(language.handleInApp),
				}))
			: params.availableLanguages,
		analyticsQueryParams: match(params.analyticsQueryParams)
			.with(P.string, (queryParams) => JSON.parse(queryParams))
			.otherwise(() => []),
		analyticsRedactFilter: match(params.analyticsRedactFilter)
			.with(P.string, (filters) => {
				try {
					return JSON.parse(filters);
				} catch (error) {
					logger.error('Failed to parse analyticsRedactFilter', {
						error,
					});
					return [];
				}
			})
			.otherwise(() => []),
		decoratorModulerVersion: modulerVersion,
		decoratorModulerEntryPoint: modulerEntryPoint,
	} as Params;
};

export const parseAndValidateParams = (
	query: Record<string, string>,
	requestHeaders: Record<string, string | undefined> = {},
	requestType?: 'ssr' | 'csr'
): Params => {
	const getConsumer = () => {
		// Denne verdien blir en del av window.__DECORATOR_DATA__.params
		if (query.teamName) {
			if (teamNameSchema.safeParse(query.teamName).success) {
				return `teamName: ${query.teamName}`;
			}
			if (requestType) {
				logger.warn('Ugyldig teamName. Forventet format: <app>.<namespace>, f.eks. nav-dekoratoren.navno', {
					metaData: { teamName: query.teamName.slice(0, 100), requestType },
				});
			}
		}

		// Automatisk fallback: nettleseren setter alltid Origin-headeren ved
		// cross-origin-forespørsler, også for senere klient-kall som /auth.
		if (requestHeaders.origin) {
			return `origin: ${requestHeaders.origin}`;
		}
	};

	const consumer = getConsumer();

	// Moduler varsler selv om manglende params.teamName ved CSR.
	// Serveren varsler i tillegg hvis verken teamName eller Origin identifiserer appen.
	const usesModuler = Boolean(query.decoratorModulerVersion);

	// Logges kun for inngangskall (/ssr, /csr). Oppfølgingskall fra klienten
	// arver teamName via decoratorParams(), så consumer er allerede logget.
	if (requestType) {
		if (!consumer) {
			if (usesModuler) {
				if (requestType === 'csr') {
					logger.warn(
						'Kunne ikke identifisere hvilken applikasjon som gjorde CSR-forespørselen. Sett params.teamName i injectDecoratorClientSide, eller sørg for at nettleseren sender en Origin-header, slik at forespørselen kan knyttes til riktig team.',
						{ metaData: { consumer: 'unknown', requestType } }
					);
				}
			} else {
				if (requestType === 'ssr') {
					logger.warn(
						'Kunne ikke identifisere hvilken applikasjon som gjorde SSR-forespørselen. Sett query-parameteren teamName slik at eventuelle feil kan spores tilbake til riktig team.'
					);
				} else if (requestType === 'csr')
					logger.warn(
						'Kunne ikke identifisere hvilken applikasjon som gjorde CSR-forespørselen. Nettleseren må sende en Origin-header for at forespørselen skal kunne knyttes til riktig app.',
						{ metaData: { consumer: 'unknown', requestType } }
					);
			}
		} else if (consumer) {
			logger.info('Decorator consumer info.', {
				metaData: { consumer, requestType },
			});
		}
	}

	const validParams = paramsSchema.safeParse(validateParams(query));

	if (!validParams.success) {
		logger.error('Failed to validate params', {
			error: validParams.error,
			metaData: { consumer: consumer ?? 'unknown' },
		});
		throw new Error('Failed to validate params');
	}

	return validParams.data;
};
