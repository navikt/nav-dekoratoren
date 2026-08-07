import { Context, Language } from "decorator-shared/params";
import { serverEnv } from "./env/server";
import { isNorwegian } from "./i18n";

const isDevMode = serverEnv.NODE_ENV === "development";

export type ContextLink = {
    url: string;
    context: Context;
};

export const makeContextLinks = (language: Language): ContextLink[] =>
    isNorwegian(language)
        ? [
              {
                  url: isDevMode
                      ? "?context=privatperson"
                      : serverEnv.XP_BASE_URL,
                  context: "privatperson",
              },
              {
                  url: isDevMode
                      ? "?context=arbeidsgiver"
                      : `${serverEnv.XP_BASE_URL}/arbeidsgiver`,
                  context: "arbeidsgiver",
              },
              {
                  url: isDevMode
                      ? "?context=samarbeidspartner"
                      : `${serverEnv.XP_BASE_URL}/samarbeidspartner`,
                  context: "samarbeidspartner",
              },
          ]
        : [];
