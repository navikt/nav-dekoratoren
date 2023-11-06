import { z } from 'zod';

export const serverSchema = z.object({
  ENONICXP_SERVICES: z.string().url(),
  XP_BASE_URL: z.string().url(),
  PORT: z.number(),
  CDN_URL: z.string().url(),
  NODE_ENV: z.enum(['production', 'development']),
  ENV: z.enum(['localhost', 'NAV_NO']),
  IS_LOCAL_PROD: z.boolean().optional(),
  HOST: z.string().url(),
})

export type RunningEnv = z.infer<typeof serverSchema>['ENV'];

export type NodeEnv = z.infer<typeof serverSchema>['NODE_ENV'];

function portToNumber(port: string | undefined) {
  if (!port) {
    throw new Error('Missing port');
  }

  const parsedPort = parseInt(port, 10);
  if (isNaN(parsedPort)) {
    throw new Error(`Invalid port: ${port}`);
  }
  return parsedPort;
}

export const serverEnv = {
  ENONICXP_SERVICES: process.env.ENONICXP_SERVICES,
  XP_BASE_URL: process.env.XP_BASE_URL,
  PORT: portToNumber(process.env.PORT),
  NODE_ENV: process.env.NODE_ENV === 'test' ? 'development' : process.env.NODE_ENV,
  ENV: process.env.ENV,
  CDN_URL: process.env.CDN_URL,
  IS_LOCAL_PROD: process.env.IS_LOCAL_PROD === 'true',
  HOST: process.env.HOST,
};

export const client_env = {
  APP_URL: process.env.HOST,
  XP_BASE_URL: process.env.XP_BASE_URL,
  LOGOUT_URL: process.env.LOGOUT_URL,
  LOGIN_URL: process.env.LOGIN_URL,
  AUTH_API_URL: process.env.AUTH_API_URL,
  MIN_SIDE_URL: process.env.MIN_SIDE_URL,
  MIN_SIDE_ARBEIDSGIVER_URL: process.env.MIN_SIDE_ARBEIDSGIVER_URL,
  VARSEL_API_URL: process.env.VARSEL_API_URL,
}



    // Reference from running decorator
    // return {
    //     ENV: process.env.ENV as string,
    //     XP_BASE_URL: process.env.XP_BASE_URL as string,
    //     APP_URL: appUrl as string,
    //     APP_BASE_URL: process.env.APP_BASE_URL as string,
    //     APP_BASE_PATH: process.env.APP_BASE_PATH as string,
    //     API_DEKORATOREN_URL: process.env.API_DEKORATOREN_URL as string,
    //     OPPORTUNITY_ID: process.env.OPPORTUNITY_ID as string,
    //     SOLUTION_ID: process.env.SOLUTION_ID as string,
    //     CASETYPE_ID: process.env.CASETYPE_ID as string,
    //     NAV_GROUP_ID: process.env.NAV_GROUP_ID as string,
    //     MINSIDE_ARBEIDSGIVER_URL: process.env.MINSIDE_ARBEIDSGIVER_URL as string,
    //     MIN_SIDE_URL: process.env.MIN_SIDE_URL as string,
    //     LOGIN_URL: process.env.LOGIN_URL as string,
    //     LOGOUT_URL: process.env.LOGOUT_URL as string,
    //     VARSEL_API_URL: process.env.VARSEL_API_URL as string,
    //     ...(req.query && {
    //         PARAMS: {
    //             CONTEXT: chosenContext,
    //             SIMPLE: req.query.simple === 'true',
    //             SIMPLE_HEADER: req.query.header === 'true' || req.query.simpleHeader === 'true', // 'header'
    //             SIMPLE_FOOTER: req.query.footer === 'true' || req.query.simpleFooter === 'true', // and 'footer' parameters are kept for legacy compatibility
    //             ENFORCE_LOGIN: req.query.enforceLogin === 'true',
    //             REDIRECT_TO_APP: req.query.redirectToApp === 'true',
    //             REDIRECT_TO_URL: req.query.redirectToUrl as string,
    //             REDIRECT_TO_URL_LOGOUT: req.query.redirectToUrlLogout as string,
    //             LEVEL: (req.query.level || 'Level3') as string,
    //             LANGUAGE: chosenLanguage,
    //             ...(req.query.availableLanguages && {
    //                 AVAILABLE_LANGUAGES: JSON.parse(req.query.availableLanguages as string),
    //             }),
    //             ...(req.query.breadcrumbs && {
    //                 BREADCRUMBS: JSON.parse(req.query.breadcrumbs as string),
    //             }),
    //             FEEDBACK: req.query.feedback === 'true',
    //             CHATBOT: req.query.chatbot !== 'false',
    //             CHATBOT_VISIBLE: req.query.chatbotVisible === 'true',
    //             URL_LOOKUP_TABLE: req.query.urlLookupTable !== 'false',
    //             ...(req.query.utilsBackground && {
    //                 UTILS_BACKGROUND: req.query.utilsBackground as string,
    //             }),
    //             SHARE_SCREEN: req.query.shareScreen !== 'false',
    //             ...(req.query.logoutUrl && {
    //                 LOGOUT_URL: req.query.logoutUrl as string,
    //             }),
    //             MASK_HOTJAR: req.query.maskHotjar !== 'false',
    //             LOGOUT_WARNING: req.query.logoutWarning === 'true',
    //         },
    //     }),
    // }
