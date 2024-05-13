import { Language, Params } from "./params";

type IdPortenLocale = "nb" | "nn" | "en" | "se";

const idPortenLocaleMap: Record<Language, IdPortenLocale> = {
    nb: "nb",
    nn: "nn",
    se: "se",
    en: "en",
    pl: "en",
    ru: "en",
    uk: "en",
};

export function getIdPortenLocale(language: Language) {
    return idPortenLocaleMap[language];
}

export function erNavDekoratoren(url: string) {
    return url.includes("dekoratoren") || url.includes("localhost:8089");
}

export function makeFrontpageUrl({
    context,
    language,
    baseUrl,
}: Pick<Params, "context" | "language"> & {
    baseUrl: string;
}) {
    if (language === "en") {
        return `${baseUrl}/en/home`;
    }

    switch (context) {
        case "privatperson":
            return `${baseUrl}/`;
        case "arbeidsgiver":
            return `${baseUrl}/no/bedrift`;
        case "samarbeidspartner":
            return `${baseUrl}/no/samarbeidspartner`;
    }
}
