import { BoostEnviroment } from 'decorator-shared/params';
import { z } from 'zod';

export const serverSchema = z.object({
    ENONICXP_SERVICES: z.string().url(),
    XP_BASE_URL: z.string().url(),
    CDN_URL: z.string().url(),
    NODE_ENV: z.enum(['production', 'development']),
    ENV: z.enum(['localhost', 'NAV_NO']),
    IS_LOCAL_PROD: z.boolean().optional(),
    HOST: z.string().url(),
    VARSEL_API_URL: z.string().url(),
});

export type RunningEnv = z.infer<typeof serverSchema>['ENV'];

export type NodeEnv = z.infer<typeof serverSchema>['NODE_ENV'];

export const serverEnv = {
    ENONICXP_SERVICES: process.env.ENONICXP_SERVICES,
    XP_BASE_URL: process.env.XP_BASE_URL,
    NODE_ENV: process.env.NODE_ENV === 'test' ? 'development' : process.env.NODE_ENV,
    ENV: process.env.ENV,
    CDN_URL: process.env.CDN_URL,
    IS_LOCAL_PROD: process.env.IS_LOCAL_PROD === 'true',
    HOST: process.env.HOST,
    VARSEL_API_URL: process.env.VARSEL_API_URL,
};

// This is session URL for prod
// https://login.nav.no/oauth2/session
export const client_env = {
    APP_URL: process.env.HOST,
    XP_BASE_URL: process.env.XP_BASE_URL,
    LOGOUT_URL: process.env.LOGOUT_URL,
    LOGIN_URL: process.env.LOGIN_URL,
    AUTH_API_URL: process.env.AUTH_API_URL,
    MIN_SIDE_URL: process.env.MIN_SIDE_URL,
    MIN_SIDE_ARBEIDSGIVER_URL: process.env.MIN_SIDE_ARBEIDSGIVER_URL,
    PERSONOPPLYSNINGER_URL: process.env.PERSONOPPLYSNINGER_URL,
    VARSEL_API_URL: process.env.VARSEL_API_URL,
    API_DEKORATOREN_URL: process.env.API_DEKORATOREN_URL,
    API_SESSION_URL: process.env.API_SESSION_URL,
    OPPORTUNITY_ID: process.env.OPPORTUNITY_ID,
    SOLUTION_ID: process.env.SOLUTION_ID,
    CASETYPE_ID: process.env.CASETYPE_ID,
    NAV_GROUP_ID: process.env.NAV_GROUP_ID,
    BOOST_ENVIRONMENT: process.env.BOOST_ENVIRONMENT as BoostEnviroment,
    ENV: serverEnv.NODE_ENV
};
