import type { ClientParams } from "./params";

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
            return `${baseUrl}/arbeidsgiver`;
        case "samarbeidspartner":
            return `${baseUrl}/samarbeidspartner`;
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
