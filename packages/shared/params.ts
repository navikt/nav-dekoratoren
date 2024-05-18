import { z } from "zod";

export const contextSchema = z.enum([
    "privatperson",
    "arbeidsgiver",
    "samarbeidspartner",
]);
export type Context = z.infer<typeof contextSchema>;

export const languageSchema = z.enum([
    "nb",
    "nn",
    "en",
    "se",
    "pl",
    "uk",
    "ru",
]);
export type Language = z.infer<typeof languageSchema>;

const availableLanguageSchema = z.discriminatedUnion("handleInApp", [
    z.object({
        handleInApp: z.literal(true),
        locale: languageSchema,
    }),
    z.object({
        handleInApp: z.literal(false),
        locale: languageSchema,
        url: z.string(),
    }),
]);
export type AvailableLanguage = z.infer<typeof availableLanguageSchema>;

const breadcrumbSchema = z.object({
    title: z.string(),
    url: z.string().optional(),
    handleInApp: z.boolean().default(false).optional(),
});
export type Breadcrumb = z.infer<typeof breadcrumbSchema>;

const utilsBackground = z.enum(["white", "gray", "transparent"]);
export type UtilsBackground = z.infer<typeof utilsBackground>;

const loginLevel = z.enum(["Level3", "Level4"]);
export type LoginLevel = z.infer<typeof loginLevel>;

export const paramsSchema = z.object({
    ssr: z.boolean().default(false),
    context: contextSchema.default("privatperson"),
    simple: z.boolean().default(false),
    simpleHeader: z.boolean().default(false),
    simpleFooter: z.boolean().default(false),
    enforceLogin: z.boolean().default(false),
    redirectToApp: z.boolean().default(false),
    // Should maybe not be this
    redirectToUrl: z.string().default(""),
    redirectToLogout: z.string().optional().default(""),
    level: loginLevel.default("Level3"),
    language: languageSchema.default("nb"),
    availableLanguages: z.array(availableLanguageSchema).default([]),
    breadcrumbs: z.array(breadcrumbSchema).default([]),
    utilsBackground: utilsBackground.default("transparent"),
    feedback: z.boolean().default(false),
    chatbot: z.boolean().default(true),
    chatbotVisible: z.boolean().default(false),
    urlLookupTable: z.boolean().default(false),
    shareScreen: z.boolean().default(true),
    // @TODO: Validering av domenet
    logoutUrl: z.string().default(""),
    maskHotjar: z.boolean().default(true),
    logoutWarning: z.boolean().default(false),
    bedrift: z.string().optional(),
    name: z.string().optional(),
});

export type Params = z.infer<typeof paramsSchema>;
export type ParamKey = keyof Params;

export const clientEnvSchema = z.object({
    MIN_SIDE_URL: z.string(),
    MIN_SIDE_ARBEIDSGIVER_URL: z.string(),
    PERSONOPPLYSNINGER_URL: z.string(),
    AUTH_API_URL: z.string(),
    VARSEL_API_URL: z.string(),
    LOGIN_URL: z.string(),
    LOGOUT_URL: z.string(),
    XP_BASE_URL: z.string(),
    APP_URL: z.string(),
    API_SESSION_URL: z.string(),
    BOOST_ENVIRONMENT: z.enum(["nav", "navtest"]),
    ENV: z.enum(["production", "development"]),
});

export type Environment = z.infer<typeof clientEnvSchema>;
export type BoostEnviroment = Environment["BOOST_ENVIRONMENT"];
