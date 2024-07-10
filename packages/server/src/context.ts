import { Context, Language } from "decorator-shared/params";
import { env } from "./env/server";
import { isNorwegian } from "./i18n";

export type ContextLink = {
    url: string;
    context: Context;
};

export const makeContextLinks = (language: Language): ContextLink[] =>
    isNorwegian(language)
        ? [
              {
                  url:
                      env.ENV === "prod"
                          ? `${env.XP_BASE_URL}`
                          : "?context=privatperson",
                  context: "privatperson",
              },
              {
                  url:
                      env.ENV === "prod"
                          ? `${env.XP_BASE_URL}/no/bedrift`
                          : "?context=arbeidsgiver",
                  context: "arbeidsgiver",
              },
              {
                  url:
                      env.ENV === "prod"
                          ? `${env.XP_BASE_URL}/no/samarbeidspartner`
                          : "?context=samarbeidspartner",
                  context: "samarbeidspartner",
              },
          ]
        : [];
