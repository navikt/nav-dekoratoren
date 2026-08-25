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

/**
 * `APP_URL` is the decorator's own public origin, and the only environment
 * value available in both runtimes: the server reads it from `process.env`,
 * the client receives it in the `__DECORATOR_DATA__` payload the server inlines
 * into the page. Neither global exists in the other runtime, so both are probed
 * defensively.
 *
 * This deliberately ignores `location`. The client bundle runs on the consuming
 * application's page, so `location` describes the consumer rather than the
 * decorator, and a consumer served from localhost must not be able to widen
 * what the production decorator accepts.
 */
const getAppUrl = (): string | undefined => {
    const fromDecoratorData = (
        globalThis as { __DECORATOR_DATA__?: { env?: { APP_URL?: string } } }
    ).__DECORATOR_DATA__?.env?.APP_URL;

    if (fromDecoratorData) {
        return fromDecoratorData;
    }

    return typeof process !== "undefined" ? process.env.APP_URL : undefined;
};

/**
 * Localhost targets only make sense while the decorator is not serving
 * production traffic. This is a positive allowlist: an APP_URL that is missing,
 * unparseable or unrecognised is treated as production, so the failure mode is
 * a rejected redirect rather than an open one.
 */
const allowLocalhost = () => {
    const appUrl = getAppUrl();

    if (!appUrl) {
        return false;
    }

    try {
        const { hostname } = new URL(appUrl);
        return hostname === "localhost" || hostname.endsWith(".dev.nav.no");
    } catch {
        return false;
    }
};

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
