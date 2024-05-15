import { MiddlewareHandler } from "hono";
import { csp } from "./content-security-policy";

export const headers: MiddlewareHandler = async (c, next) => {
    await next();

    const origin = c.req.header("origin") ?? "";
    if (
        [
            ".nav.no",
            ".oera.no",
            ".nais.io",
            "https://preview-sykdomifamilien.gtsb.io",
            "navdialog--sit2.sandbox.my.site.com",
            "navdialog--uathot.sandbox.my.site.com",
        ].some((domain) => origin.endsWith(domain)) ||
        origin.includes("localhost:")
    ) {
        c.header("Access-Control-Allow-Origin", origin);
        c.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        c.header("Access-Control-Allow-Credentials", "true");
        c.header(
            "Access-Control-Allow-Headers",
            "cookie,Content-Type,Authorization",
        );
    }

    c.header("Content-Security-Policy", csp);
    c.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    c.header("Pragma", "no-cache");
    c.header("Expires", "-1");
};
