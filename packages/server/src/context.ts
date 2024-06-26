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
                  url: `${env.XP_BASE_URL}`,
                  lenkeTekstId: "rolle_privatperson",
                  context: "privatperson",
              },
              {
                  url: `${env.XP_BASE_URL}/no/bedrift`,
                  lenkeTekstId: "rolle_arbeidsgiver",
                  context: "arbeidsgiver",
              },
              {
                  url: `${env.XP_BASE_URL}/no/samarbeidspartner`,
                  lenkeTekstId: "rolle_samarbeidspartner",
                  context: "samarbeidspartner",
              },
          ]
        : [];
