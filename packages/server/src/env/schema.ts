import { z } from "zod";

export const serverSchema = z.object({
    APP_NAME: z.string(),
    APP_URL: z.url(),
    CDN_URL: z.url(),
    DEKORATOREN_API_URL: z.url(),
    ENONICXP_SERVICES: z.url(),
    IS_INTERNAL_APP: z.stringbool().optional(),
    LOGIN_URL: z.url(),
    NODE_ENV: z.preprocess(
        (v) => (v === "test" ? "development" : v),
        z.enum(["production", "development"]),
    ),
    PERSONOPPLYSNINGER_URL: z.string(),
    PORT: z.coerce.number().default(8089),
    SEARCH_API_URL: z.url(),
    // should these be optional on the server?
    UMAMI_WEBSITE_ID: z.string().optional(),
    // can proxy-host be a url type?
    UMAMI_PROXY_HOST: z.string().optional(),
    VARSEL_API_URL: z.url(),
    UNLEASH_SERVER_API_TOKEN: z.string(),
    UNLEASH_SERVER_API_URL: z.url(),
    VERSION_ID: z.string(),
    XP_BASE_URL: z.url(),
});
