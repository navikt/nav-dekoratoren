import { Context, Language } from "decorator-shared/params";
import { TextKey } from "decorator-shared/types";
import { env } from "./env/server";
import { isNorwegian } from "./i18n";

export type ContextLink = {
    url: string;
    lenkeTekstId: TextKey;
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
                  lenkeTekstId: "rolle_privatperson",
                  context: "privatperson",
              },
              {
                  url:
                      env.ENV === "prod"
                          ? `${env.XP_BASE_URL}/no/bedrift`
                          : "?context=arbeidsgiver",
                  lenkeTekstId: "rolle_arbeidsgiver",
                  context: "arbeidsgiver",
              },
              {
                  url:
                      env.ENV === "prod"
                          ? `${env.XP_BASE_URL}/no/samarbeidspartner`
                          : "?context=samarbeidspartner",
                  lenkeTekstId: "rolle_samarbeidspartner",
                  context: "samarbeidspartner",
              },
          ]
        : [];
