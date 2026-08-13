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

const ALLOWED_DOMAINS = ["nav.no", "nais.io"];

/**
 * Browsers strip tab/newline characters from URLs before parsing them, so any
 * validation has to do the same or it can be tricked into checking a different
 * string than the one that actually gets navigated to.
 */
const normalize = (url: string) => url.replace(/[\t\r\n]/g, "");

/**
 * A relative path is only safe if it can't be reinterpreted as another origin.
 * "//evil.com" is protocol-relative, and browsers normalize "\" to "/", which
 * makes "/\evil.com" protocol-relative as well.
 */
const isSafeRelativePath = (url: string) =>
    url.startsWith("/") && !url.startsWith("//") && !url.startsWith("/\\");

const isAllowedDomain = (hostname: string) =>
    ALLOWED_DOMAINS.some(
        (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    );

const allowLocalhost = () =>
    typeof process === "undefined" || process.env?.NODE_ENV !== "production";

export const isValidNavUrl = (url: string) => {
    const normalized = normalize(url);

    if (isSafeRelativePath(normalized)) {
        return true;
    }

    let parsed: URL;
    try {
        parsed = new URL(normalized);
    } catch {
        return false;
    }

    // "https://localhost@evil.com" and friends: the host is evil.com, not localhost
    if (parsed.username || parsed.password) {
        return false;
    }

    if (
        allowLocalhost() &&
        parsed.hostname === "localhost" &&
        (parsed.protocol === "http:" || parsed.protocol === "https:")
    ) {
        return true;
    }

    return parsed.protocol === "https:" && isAllowedDomain(parsed.hostname);
};
