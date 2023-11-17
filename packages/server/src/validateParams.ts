import { paramsSchema } from 'decorator-shared/params';
import { clientEnv } from './env/server';
import { P, match } from 'ts-pattern';
import { ZodBoolean, ZodDefault } from 'zod';

export const getBooleans = () => Object.entries(paramsSchema.shape)
    .reduce((prev, [key, value]) => {
        if  (value instanceof ZodDefault && value._def.innerType instanceof ZodBoolean) {
            return [...prev, key]
        }
        return prev
    }, new Array<string>())

export const parseBooleanParam = (param?: unknown): boolean =>
    match(param)
        .with(P.string, (param) => param === 'true')
        .with(P.boolean, (param) => param)
        .otherwise(() => false);

const booleans = getBooleans()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateParams = (params: Record<string, string>) => {
  return {
    ...params,
    ...booleans.reduce(
      (prev, key) => ({
        ...prev,
        [key]: parseBooleanParam(params[key]),
      }),
      {},
    ),
    logoutUrl: match(params.logoutUrl)
      .with(P.string, (url) => url)
      .otherwise(() => clientEnv.LOGOUT_URL),
    breadcrumbs: match(params.breadcrumbs)
      .with(P.string, (breadcrumbs) => JSON.parse(breadcrumbs))
      .otherwise(() => []),
    availableLanguages: params.availableLanguages
      ? JSON.parse(params.availableLanguages).map((language: any) => ({
          ...language,
          handleInApp: parseBooleanParam(language.handleInApp),
        }))
      : params.availableLanguages,
  };
};

export const validParams = (query: Record<string, string>) => {
  const validParams = paramsSchema.safeParse(validateParams(query));

  if (!validParams.success) {
    console.error(validParams.error);
    throw new Error(validParams.error.toString());
  }

  return validParams.data;
};
