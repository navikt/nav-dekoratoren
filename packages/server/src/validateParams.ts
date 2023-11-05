import { paramsSchema } from 'decorator-shared/params';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateParams = (params: any) => {
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

  return paramsSchema.safeParse({
    ...params,
    ...booleans.reduce(
      (prev, key) => ({
        ...prev,
        [key]: parseBooleanParam(params[key]),
      }),
      {},
    ),
    breadcrumbs: params.breadcrumbs
      ? JSON.parse(params.breadcrumbs)
      : params.breadcrumbs,
    availableLanguages: params.availableLanguages
      ? JSON.parse(params.availableLanguages).map((language: any) => ({
          ...language,
          handleInApp: parseBooleanParam(language.handleInApp),
        }))
      : params.availableLanguages,
  });
};
