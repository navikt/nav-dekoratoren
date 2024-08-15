import { ClientParams } from "./params";

export function erNavDekoratoren(url: string) {
    return url.includes("dekoratoren") || url.includes("localhost:8089");
}

export function makeFrontpageUrl({
    context,
    language,
    baseUrl,
}: Pick<ClientParams, "context" | "language"> & {
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

const isLocalhost = (url: string) =>
    /^(https?:\/\/localhost(:\d+)?)/i.test(url);
const isPath = (url: string) => /^(\/)/i.test(url);
const isNavOrNais = (url: string) =>
    /^((https:\/\/([a-z0-9-]+\.)*((nav\.no)|(nais\.io)))($|\/))/i.test(url);

export const isValidNavUrl = (url: string) => {
    return isLocalhost(url) || isPath(url) || isNavOrNais(url);
};
