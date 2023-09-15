import z from 'zod';

export function formatParams(params: Partial<Params>) {
  return new URLSearchParams(
    Object.entries(params).map(([k, v]) =>
      Array.isArray(v) ? [k, JSON.stringify(v)] : [k, v.toString()],
    ),
  );
}

const authLevelSchema = z.enum(['Level3', 'Level4']);
const languageSchema = z.enum(['nb', 'nn', 'en', 'se', 'pl', 'uk', 'ru']);
const contextSchema = z.enum([
  'privatperson',
  'arbeidsgiver',
  'samarbeidspartner',
]);

export const breadcrumbSchema = z.object({
  title: z.string(),
  url: z.string(),
  handleInApp: z.boolean().default(false).optional(),
});
const utilsBackground = z.enum(['white', 'gray', 'transparent']);

export type Context = z.infer<typeof contextSchema>;
export type Language = z.infer<typeof languageSchema>;
export type Breadcrumb = z.infer<typeof breadcrumbSchema>;
export type UtilsBackground = z.infer<typeof utilsBackground>;
export type AvailableLanguage = z.infer<typeof availableLanguageSchema>;

const availableLanguageSchema = z.object({
  locale: languageSchema,
  url: z.string().optional(),
  handleInApp: z.boolean().default(false).optional(),
});

const paramsSchema = z.object({
  context: contextSchema.default('privatperson'),
  simple: z.boolean().default(false),
  simpleHeader: z.boolean().default(false),
  simpleFooter: z.boolean().default(false),
  enforceLogin: z.boolean().default(false),
  redirectToApp: z.boolean().default(false),
  level: authLevelSchema.default('Level3'),
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
});

export type Params = z.infer<typeof paramsSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateParams = (params: any) => {
  return paramsSchema.safeParse({
    ...params,
    simple: parseBooleanParam(params.simple),
    feedback: parseBooleanParam(params.feedback),
    breadcrumbs: params.breadcrumbs
      ? JSON.parse(params.breadcrumbs)
      : params.breadcrumbs,
    availableLanguages: params.availableLanguages
      ? JSON.parse(params.availableLanguages)
      : params.availableLanguages,
  });
};

function parseBooleanParam(param: string | undefined): boolean {
  return param === 'true' ? true : false;
}
