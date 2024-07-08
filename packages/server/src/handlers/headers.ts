import { MiddlewareHandler } from "hono";
import { csp } from "../content-security-policy";

const ALLOWED_DOMAINS = [
    ".nav.no",
    ".oera.no",
    ".nais.io",
    "preview-sykdomifamilien.gtsb.io",
    "navdialog--sit2.sandbox.my.site.com",
    "navdialog--uathot.sandbox.my.site.com",
] as const;

const isAllowedOrigin = (origin?: string) =>
    origin &&
    (ALLOWED_DOMAINS.some((domain) => origin.endsWith(domain)) ||
        origin.includes("localhost:"));

export const getHeaders = (origin?: string) => {
    const headers: Record<string, string> = {};

    if (origin && isAllowedOrigin(origin)) {
        headers["Access-Control-Allow-Origin"] = origin;
        headers["Access-Control-Allow-Methods"] = "GET,HEAD,OPTIONS,POST,PUT";
        headers["Access-Control-Allow-Credentials"] = "true";
        headers["Access-Control-Allow-Headers"] =
            "cookie,Content-Type,Authorization";
    }

    headers["Content-Security-Policy"] = csp;
    headers["Cache-Control"] = "private, no-cache, no-store, must-revalidate";
    headers["Pragma"] = "no-cache";
    headers["Expires"] = "-1";

    return headers;
};

export const headersMiddleware: MiddlewareHandler = async (c, next) => {
    await next();

    const origin = c.req.header("origin");

    Object.entries(getHeaders(origin)).forEach(([name, value]) =>
        c.header(name, value),
    );
};
