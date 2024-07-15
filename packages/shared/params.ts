import { z } from "zod";
import { isValidNavUrl } from "./urls";

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
        url: z.optional(z.string().refine(isValidNavUrl)).catch(undefined),
    }),
    z.object({
        handleInApp: z.literal(false),
        locale: languageSchema,
        url: z.string().refine(isValidNavUrl),
    }),
]);
export type AvailableLanguage = z.infer<typeof availableLanguageSchema>;

const breadcrumbSchema = z.object({
    title: z.string(),
    url: z.optional(z.string().refine(isValidNavUrl)).catch(undefined),
    handleInApp: z.boolean().default(false).optional(),
});
export type Breadcrumb = z.infer<typeof breadcrumbSchema>;

const utilsBackground = z.enum(["white", "gray", "transparent"]);
export type UtilsBackground = z.infer<typeof utilsBackground>;

const loginLevel = z.enum(["Level3", "Level4"]);
export type LoginLevel = z.infer<typeof loginLevel>;

export const paramsSchema = z.object({
    context: contextSchema.default("privatperson"),
    simple: z.boolean().default(false),
    simpleHeader: z.boolean().default(false),
    simpleFooter: z.boolean().default(false),
    enforceLogin: z.boolean().default(false),
    redirectToApp: z.boolean().default(false),
    redirectToUrl: z
        .optional(z.string().refine(isValidNavUrl))
        .catch(undefined),
    redirectToUrlLogout: z
        .optional(z.string().refine(isValidNavUrl))
        .catch(undefined),
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
    logoutUrl: z.optional(z.string().refine(isValidNavUrl)).catch(undefined),
    maskHotjar: z.boolean().default(true),
    logoutWarning: z.boolean().default(false),
    bedrift: z.string().optional(),
    ssrMainMenu: z.boolean().default(false),
});

export type Params = z.infer<typeof paramsSchema>;

export const clientParamKeys = [
    "context",
    "simple",
    "simpleHeader",
    "redirectToApp",
    "redirectToUrl",
    "level",
    "language",
    "availableLanguages",
    "breadcrumbs",
    "utilsBackground",
    "chatbot",
    "chatbotVisible",
    "shareScreen",
    "maskHotjar",
    "logoutWarning",
    "feedback",
] as const;

export type ClientParams = Pick<Params, (typeof clientParamKeys)[number]>;

export const clientEnvSchema = z.object({
    APP_URL: z.string(),
    BOOST_ENV: z.enum(["nav", "navtest"]),
    LOGIN_SESSION_API_URL: z.string(),
    LOGOUT_URL: z.string(),
    MIN_SIDE_ARBEIDSGIVER_URL: z.string(),
    MIN_SIDE_URL: z.string(),
    PUZZEL_CUSTOMER_ID: z.string(),
    VERSION_ID: z.string(),
    XP_BASE_URL: z.string(),
});

export type Environment = z.infer<typeof clientEnvSchema>;
export type BoostEnviroment = Environment["BOOST_ENV"];
