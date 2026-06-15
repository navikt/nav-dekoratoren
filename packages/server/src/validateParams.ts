import {
    paramsSchema,
    type Params,
    AvailableLanguage,
    modulerEntryPointSchema,
    modulerVersionSemverSchema,
} from "decorator-shared/params";
import { clientEnv } from "./env/server";
import { P, match } from "ts-pattern";
import { ZodBoolean, ZodDefault } from "zod";
import { logger } from "decorator-shared/logger";

const booleans = Object.entries(paramsSchema.shape).reduce<string[]>(
    (prev, [key, value]) => {
        if (
            value instanceof ZodDefault &&
            value._def.innerType instanceof ZodBoolean
        ) {
            return [...prev, key];
        }
        return prev;
    },
    [],
);

export const parseBooleanParam = (param?: unknown): boolean =>
    match(param)
        .with(P.string, (param) => param === "true")
        .with(P.boolean, (param) => param)
        .otherwise(() => false);

export const validateParams = (params: Record<string, string>) => {
    const reduced = booleans.reduce((prev, key) => {
        const exists = params[key] !== undefined;
        const isOptional = !(
            paramsSchema.shape[key as keyof Params] instanceof ZodDefault
        );
        const shouldParse = exists || isOptional;

        return {
            ...prev,
            [key]: shouldParse
                ? parseBooleanParam(params[key])
                : paramsSchema.shape[key as keyof Params].parse(params[key]),
        };
    }, {});
    const modulerVersion = modulerVersionSemverSchema.safeParse(
        params.decoratorModulerVersion,
    ).data;
    const modulerEntryPoint = modulerEntryPointSchema.safeParse(
        params.decoratorModulerEntryPoint,
    ).data;

    return {
        ...params,
        ...reduced,
        logoutUrl: match(params.logoutUrl)
            .with(P.string, (url) => url)
            .otherwise(() => clientEnv.LOGOUT_URL),
        breadcrumbs: match(params.breadcrumbs)
            .with(P.string, (breadcrumbs) => JSON.parse(breadcrumbs))
            .otherwise(() => []),
        availableLanguages: params.availableLanguages
            ? JSON.parse(params.availableLanguages).map(
                  (language: AvailableLanguage) => ({
                      ...language,
                      handleInApp: parseBooleanParam(language.handleInApp),
                  }),
              )
            : params.availableLanguages,
        analyticsQueryParams: match(params.analyticsQueryParams)
            .with(P.string, (queryParams) => JSON.parse(queryParams))
            .otherwise(() => []),
        analyticsRedactFilter: match(params.analyticsRedactFilter)
            .with(P.string, (filters) => {
                try {
                    return JSON.parse(filters);
                } catch (error) {
                    logger.error("Failed to parse analyticsRedactFilter", {
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
    requestHeaders?: Record<string, string | undefined>,
    requestType?: "ssr" | "csr",
): Params => {
    logger.info(
        `Request query: ${JSON.stringify(query)} with headers: ${JSON.stringify(requestHeaders)} and request type: ${requestType}`,
    );
    const appName = query.naisAppName;
    const namespace = query.naisNamespace;

    const consumer = appName
        ? `${namespace ?? "unknown"}/${appName}`
        : requestHeaders?.["x-teamname"]
          ? `x-teamname: ${requestHeaders["x-teamname"]}`
          : requestHeaders?.["origin"]
            ? `origin: ${requestHeaders["origin"]}`
            : undefined;

    if (consumer === undefined) {
        if (requestType === "ssr") {
            logger.warn(
                "Kunne ikke identifisere hvilken applikasjon som gjorde SSR-forespørselen. Sett request-headeren X-Teamname slik at eventuelle feil kan spores tilbake til riktig team.",
            );
        } else if (requestType === "csr") {
            logger.warn(
                "Kunne ikke identifisere hvilken applikasjon som gjorde CSR-forespørselen. Sørg for at nettleseren sender med en Origin-header (settes automatisk ved cross-origin-forespørsler). Hvis du bruker @navikt/nav-dekoratoren-moduler, må du angi teamName i injectDecoratorClientSide slik at forespørselen kan knyttes til riktig team.",
            );
        }
    }

    logger.info("Decorator request", {
        metaData: { consumer: consumer ?? "unknown" },
    });

    const validParams = paramsSchema.safeParse(validateParams(query));

    if (!validParams.success) {
        logger.error("Failed to validate params", {
            error: validParams.error,
            metaData: { consumer: consumer ?? "unknown" },
        });
        throw new Error("Failed to validate params");
    }

    return validParams.data;
};
