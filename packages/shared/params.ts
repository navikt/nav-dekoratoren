import z from 'zod';

export function formatParams(params: Partial<Params>) {
  return new URLSearchParams(
    Object.entries(params).map(([k, v]) =>
      Array.isArray(v) ? [k, JSON.stringify(v)] : [k, v.toString()],
    ),
  );
}

const contextSchema = z.enum([
  'privatperson',
  'arbeidsgiver',
  'samarbeidspartner',
  'ikkebestemt',
]);

export type Context = z.infer<typeof contextSchema>;

const languageSchema = z.enum(['nb', 'nn', 'en', 'se', 'pl', 'uk', 'ru']);
export type Language = z.infer<typeof languageSchema>;

const availableLanguageSchema = z.object({
  locale: languageSchema,
  url: z.string().optional(),
  handleInApp: z.boolean().default(false).optional(),
});
export type AvailableLanguage = z.infer<typeof availableLanguageSchema>;

const breadcrumbSchema = z.object({
  title: z.string(),
  url: z.string().optional(),
  handleInApp: z.boolean().default(false).optional(),
});
export type Breadcrumb = z.infer<typeof breadcrumbSchema>;

const utilsBackground = z.enum(['white', 'gray', 'transparent']);
export const utilsBackgrounds = utilsBackground.options;
export type UtilsBackground = z.infer<typeof utilsBackground>;

const loginLevel = z.enum(['Level3', 'Level4']);
export type LoginLevel = z.infer<typeof loginLevel>;

export const paramsSchema = z.object({
  context: contextSchema.default('privatperson'),
  simple: z.boolean().default(false),
  simpleHeader: z.boolean().default(false),
  simpleFooter: z.boolean().default(false),
  enforceLogin: z.boolean().default(false),
  redirectToApp: z.boolean().default(false),
  // Should maybe not be this
  redirectToUrl: z.string().default(''),
  level: loginLevel.default('Level3'),
  language: languageSchema.default('nb'),
  availableLanguages: z.array(availableLanguageSchema).default([]),
  breadcrumbs: z.array(breadcrumbSchema).default([]),
  utilsBackground: utilsBackground.default('transparent'),
  feedback: z.boolean().default(false),
  chatbot: z.boolean().default(true),
  chatbotVisible: z.boolean().default(false),
  urlLookupTable: z.boolean().default(false),
  shareScreen: z.boolean().default(false),
  logoutUrl: z.string().url().optional(),
  maskHotjar: z.boolean().default(false),
  logoutWarning: z.boolean().default(false),
});

export type Params = z.infer<typeof paramsSchema>;

export const environmentSchema = z.object({
  MIN_SIDE_URL: z.string(),
  MIN_SIDE_ARBEIDSGIVER_URL: z.string(),
  LOGIN_URL: z.string(),
  LOGOUT_URL: z.string(),
  XP_BASE_URL: z.string(),
});

export type Environment = z.infer<typeof environmentSchema>;
