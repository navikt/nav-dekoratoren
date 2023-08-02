import z from 'zod';

declare global {
  namespace Express {
    export interface Request {
      decorator: Params;
    }
    // export interface Response {
    //     components: ReturnType<typeof GetComponents>;
    //     sendView: (view: ViewKey, data?: any) => void
    // }
  }
}

const authLevelSchema = z.enum(['Level3', 'Level4']);
const languageSchema = z.enum(['nb', 'nn', 'en', 'se', 'pl', 'uk', 'ru']);
const contextSchema = z.enum([
  'privatperson',
  'arbeidsgiver',
  'samarbeidspartner',
]);

export type Context = z.infer<typeof contextSchema>;

export const breadcrumbSchema = z.object({
  title: z.string(),
  url: z.string(),
  handleInApp: z.boolean().default(false),
});

export type Breadcrumb = z.infer<typeof breadcrumbSchema>;

const utilsBackground = z.enum(['white', 'gray', 'transparent']);

export type UtilsBackground = z.infer<typeof utilsBackground>;

const paramsSchema = z.object({
  context: contextSchema.default('privatperson'),
  simple: z.boolean().default(false),
  simpleHeader: z.boolean().default(false),
  simpleFooter: z.boolean().default(false),
  enforceLogin: z.boolean().default(false),
  redirectToApp: z.boolean().default(false),
  level: authLevelSchema.default('Level3'),
  language: languageSchema.default('nb'),
  availableLanguages: z
    .array(
      z.object({
        locale: languageSchema,
        url: z.string().url().optional(),
      }),
    )
    .default([]),
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

export const parseParams = (params: any) => {
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

// Make into string that can be put i URL
export function parseParamsClient(params: URLSearchParams) {
  const result: any = {};

  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) {
      // it's an array, so we need to stringify it
      result[k] = JSON.stringify(v);
    } else {
      result[k] = v.toString();
    }
  }

  return result as Params;
}

// function
