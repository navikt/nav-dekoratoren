import { paramsSchema } from 'decorator-shared/params';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateParams = (params: any) => {
  const parseBooleanParam = (param?: string): boolean =>
    param === 'true' ? true : false;

  return paramsSchema.safeParse({
    ...params,
    simple: parseBooleanParam(params.simple),
    feedback: parseBooleanParam(params.feedback),
    logoutWarning: parseBooleanParam(params.logoutWarning),
    breadcrumbs: params.breadcrumbs
      ? JSON.parse(params.breadcrumbs)
      : params.breadcrumbs,
    availableLanguages: params.availableLanguages
      ? JSON.parse(params.availableLanguages)
      : params.availableLanguages,
  });
};
