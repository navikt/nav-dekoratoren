import { BoostEnviroment, Environment } from "decorator-shared/params";
import { z } from "zod";

export const serverSchema = z.object({
    API_DEKORATOREN_URL: z.string().url(),
    APP_URL: z.string().url(),
    CDN_URL: z.string().url(),
    ENONICXP_SERVICES: z.string().url(),
    ENV: z.enum(["localhost", "dev", "prod"]),
    HAS_EXTERNAL_DEV_CONSUMER: z.boolean(),
    IS_LOCAL_PROD: z.boolean().optional(),
    LOGIN_URL: z.string().url(),
    NODE_ENV: z.enum(["production", "development"]),
    SEARCH_API: z.string().url(),
    VARSEL_API_URL: z.string().url(),
    UNLEASH_SERVER_API_TOKEN: z.string(),
    UNLEASH_SERVER_API_URL: z.string().url(),
    XP_BASE_URL: z.string().url(),
});

export const serverEnv = {
    API_DEKORATOREN_URL: process.env.API_DEKORATOREN_URL,
    APP_URL: process.env.APP_URL,
    CDN_URL: process.env.CDN_URL,
    ENONICXP_SERVICES: process.env.ENONICXP_SERVICES,
    ENV: process.env.ENV,
    HAS_EXTERNAL_DEV_CONSUMER: process.env.HAS_EXTERNAL_DEV_CONSUMER === "true",
    IS_LOCAL_PROD: process.env.IS_LOCAL_PROD === "true",
    LOGIN_URL: process.env.LOGIN_URL,
    NODE_ENV:
        process.env.NODE_ENV === "test" ? "development" : process.env.NODE_ENV,
    SEARCH_API: process.env.SEARCH_API,
    UNLEASH_SERVER_API_TOKEN: process.env.UNLEASH_SERVER_API_TOKEN,
    UNLEASH_SERVER_API_URL: process.env.UNLEASH_SERVER_API_URL,
    VARSEL_API_URL: process.env.VARSEL_API_URL,
    XP_BASE_URL: process.env.XP_BASE_URL,
};

// This is session URL for prod
// https://login.nav.no/oauth2/session
export const client_env = {
    API_SESSION_URL: process.env.API_SESSION_URL,
    APP_URL: process.env.APP_URL,
    AUTH_API_URL: process.env.AUTH_API_URL,
    BOOST_ENV: process.env.BOOST_ENV as BoostEnviroment,
    CDN_URL: process.env.CDN_URL,
    ENV: serverEnv.ENV,
    LOGIN_URL: process.env.LOGIN_URL,
    LOGOUT_URL: process.env.LOGOUT_URL,
    MIN_SIDE_ARBEIDSGIVER_URL: process.env.MIN_SIDE_ARBEIDSGIVER_URL,
    MIN_SIDE_URL: process.env.MIN_SIDE_URL,
    PERSONOPPLYSNINGER_URL: process.env.PERSONOPPLYSNINGER_URL,
    PUZZEL_CUSTOMER_ID: process.env.PUZZEL_CUSTOMER_ID,
    VARSEL_API_URL: process.env.VARSEL_API_URL,
    XP_BASE_URL: process.env.XP_BASE_URL,
} satisfies Record<keyof Environment, unknown>;
