import { Params } from "./params";

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
