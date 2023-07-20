import z from "zod";

const authLevelSchema = z.enum(["Level3", "Level4"]);
const languageSchema = z.enum(["nb", "nn", "en", "se", "pl", "uk", "ru"]);
const contextSchema = z.enum([
  "privatperson",
  "arbeidsgiver",
  "samarbeidspartner",
]);

const breadcrumbSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  handleInApp: z.boolean().default(false),
});

const background = z.enum(["white", "gray", "transparent"]);

const paramsSchema = z.object({
  context: contextSchema.default("privatperson"),
  simple: z.boolean().default(false),
  simpleHeader: z.boolean().default(false),
  simpleFooter: z.boolean().default(false),
  enforceLogin: z.boolean().default(false),
  redirectToApp: z.boolean().default(false),
  level: authLevelSchema.default("Level3"),
  language: languageSchema.default("nb"),
  availableLanguages: z
    .array(
      z.object({
        locale: languageSchema,
        url: z.string().url(),
      })
    )
    .default([]),
  breadcrumbs: z.array(breadcrumbSchema).default([]),
  utilsBackground: background.default("transparent"),
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
    simple:
      params.simple === "true"
        ? true
        : params.simple === "false"
        ? false
        : params.simple,
    breadcrumbs: JSON.parse(params.breadcrumbs),
  });
};
