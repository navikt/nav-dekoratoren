import {
    paramsSchema,
    type Params,
    AvailableLanguage,
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
    } as Params;
};

export const parseAndValidateParams = (
    query: Record<string, string>,
): Params => {
    const validParams = paramsSchema.safeParse(validateParams(query));

    if (!validParams.success) {
        logger.error("Failed to validate params", { error: validParams.error });
        throw new Error(validParams.error.toString());
    }

    return validParams.data;
};
