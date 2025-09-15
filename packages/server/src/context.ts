import { Context, Language } from "decorator-shared/params";
import { env } from "./env/server";
import { isNorwegian } from "./i18n";

const isDevMode = env.NODE_ENV === "development";

export type ContextLink = {
    url: string;
    context: Context;
};

export const makeContextLinks = (language: Language): ContextLink[] =>
    isNorwegian(language)
        ? [
              {
                  url: isDevMode ? "?context=privatperson" : env.XP_BASE_URL,
                  context: "privatperson",
              },
              {
                  url: isDevMode
                      ? "?context=arbeidsgiver"
                      : `${env.XP_BASE_URL}/no/arbeidsgiver`,
                  context: "arbeidsgiver",
              },
              {
                  url: isDevMode
                      ? "?context=samarbeidspartner"
                      : `${env.XP_BASE_URL}/no/samarbeidspartner`,
                  context: "samarbeidspartner",
              },
          ]
        : [];
