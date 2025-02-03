import { BoostEnviroment, Environment } from "decorator-shared/params";
import { z } from "zod";

export const serverSchema = z.object({
    APP_NAME: z.string(),
    APP_URL: z.string().url(),
    CDN_URL: z.string().url(),
    DEKORATOREN_API_URL: z.string().url(),
    ENONICXP_SERVICES: z.string().url(),
    IS_INTERNAL_APP: z.boolean(),
    LOGIN_URL: z.string().url(),
    NODE_ENV: z.enum(["production", "development"]),
    PERSONOPPLYSNINGER_URL: z.string(),
    SEARCH_API_URL: z.string().url(),
    VARSEL_API_URL: z.string().url(),
    UNLEASH_SERVER_API_TOKEN: z.string(),
    UNLEASH_SERVER_API_URL: z.string().url(),
    VERSION_ID: z.string(),
    XP_BASE_URL: z.string().url(),
} satisfies Record<keyof typeof serverEnv, unknown>);

export const serverEnv = {
    APP_NAME: process.env.APP_NAME,
    APP_URL: process.env.APP_URL,
    CDN_URL: process.env.CDN_URL,
    DEKORATOREN_API_URL: process.env.DEKORATOREN_API_URL,
    ENONICXP_SERVICES: process.env.ENONICXP_SERVICES,
    IS_INTERNAL_APP: process.env.IS_INTERNAL_APP === "true",
    LOGIN_URL: process.env.LOGIN_URL,
    NODE_ENV:
        process.env.NODE_ENV === "test" ? "development" : process.env.NODE_ENV,
    PERSONOPPLYSNINGER_URL: process.env.PERSONOPPLYSNINGER_URL,
    SEARCH_API_URL: process.env.SEARCH_API_URL,
    UNLEASH_SERVER_API_TOKEN: process.env.UNLEASH_SERVER_API_TOKEN,
    UNLEASH_SERVER_API_URL: process.env.UNLEASH_SERVER_API_URL,
    VARSEL_API_URL: process.env.VARSEL_API_URL,
    VERSION_ID: process.env.VERSION_ID,
    XP_BASE_URL: process.env.XP_BASE_URL,
};

// This is session URL for prod
// https://login.nav.no/oauth2/session
export const client_env = {
    APP_URL: process.env.APP_URL,
    BOOST_ENV: process.env.BOOST_ENV as BoostEnviroment,
    CDN_URL: process.env.CDN_URL,
    LOGIN_SESSION_API_URL: process.env.LOGIN_SESSION_API_URL,
    LOGOUT_URL: process.env.LOGOUT_URL,
    MIN_SIDE_ARBEIDSGIVER_URL: process.env.MIN_SIDE_ARBEIDSGIVER_URL,
    MIN_SIDE_URL: process.env.MIN_SIDE_URL,
    PUZZEL_CUSTOMER_ID: process.env.PUZZEL_CUSTOMER_ID,
    VERSION_ID: process.env.VERSION_ID,
    XP_BASE_URL: process.env.XP_BASE_URL,
    UMAMI_WEBSITE_ID: process.env.UMAMI_WEBSITE_ID,
} satisfies Record<keyof Environment, unknown>;
