import { paramsSchema } from 'decorator-shared/params';
import { clientEnv } from './env/server';
import { P, match } from 'ts-pattern';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateParams = (params: Record<string, string>) => {
  const parseBooleanParam = (param?: string | boolean): boolean =>
    typeof param === 'boolean' ? param : param === 'true' ? true : false;

  const booleans = [
    'simple',
    'simpleHeader',
    'simpleFooter',
    'enforceLogin',
    'feedback',
    'logoutWarning',
    'redirectToApp',
    'chatbot',
    'chatbotVisible',
    'urlLookupTable',
    'shareScreen',
    'maskHotjar',
  ];

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
    const validParams = paramsSchema.safeParse(
        validateParams(query)
    );

    if (!validParams.success) {
      console.error(validParams.error);
      throw new Error(validParams.error.toString());
    }

    return validParams.data;
  };
