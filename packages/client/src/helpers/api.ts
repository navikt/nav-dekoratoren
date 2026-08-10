import { corgi, type Plugin, type Query } from "@itsy/corgi/chonk";
import { type ClientParams } from "decorator-shared/params";
import { CONSUMER, VERSION_ID_PARAM } from "decorator-shared/constants";
import { env } from "../params";

// Always-on, never-overridden request metadata (cache-busting version id +
// consumer tag). Safe to live in a plugin: nothing ever overrides these, so
// there's no override-precedence footgun to get wrong.
const withDecoratorMeta = (): Plugin => (next) => (url, init) => {
    const u = new URL(url);
    u.searchParams.set(VERSION_ID_PARAM, env("VERSION_ID"));
    u.searchParams.set("consumer", CONSUMER);
    return next(u.toString(), init);
};

export const decoratorApi = corgi.create({
    baseURL: env("APP_URL"),
    plugins: [withDecoratorMeta()],
    retry: 2,
});

type DecoratorFetchOverrides = Partial<ClientParams> & Record<string, unknown>;

/**
 * Current decorator client params, merged with per-call overrides.
 * Array fields are JSON-stringified — the server (packages/server/src/validateParams.ts)
 * expects a string and not Corgi's default of repeated-keys - applies to namely
 * `breadcrumbs`/`availableLanguages`/`analyticsQueryParams`/`analyticsRedactFilter`,
 */
export const decoratorParams = (overrides?: DecoratorFetchOverrides): Query => {
    const merged: Record<string, unknown> = {
        ...window.__DECORATOR_DATA__.params,
        ...overrides,
    };
    return Object.fromEntries(
        Object.entries(merged).map(([key, value]) => [
            key,
            Array.isArray(value) ? JSON.stringify(value) : value,
        ]),
    ) as Query;
};
