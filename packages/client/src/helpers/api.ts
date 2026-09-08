import { corgi, type Plugin, type Query } from "@itsy/corgi/chonk";
import { type ClientParams } from "decorator-shared/params";
import { CONSUMER, VERSION_ID_PARAM } from "decorator-shared/constants";
import { env } from "../params";

/**
 * Resolves a decorator route against `APP_URL`.
 *
 * `APP_URL` is NOT origin-only: in prod it is `https://www.nav.no/dekoratoren`,
 * and the ingresses don't strip that prefix (see INGRESS_PATH_PREFIXES in
 * packages/server/src/routes.ts). `new URL("/main-menu", APP_URL)` would drop
 * the prefix entirely - a root-relative path replaces the whole base path - and
 * send the request to `https://www.nav.no/main-menu`, which never reaches us.
 * So the paths are concatenated instead of resolved.
 */
const resolveUrl = (url: string) => {
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(url)) return new URL(url);
    const base = env("APP_URL").replace(/\/+$/, "");
    return new URL(`${base}/${url.replace(/^\/+/, "")}`);
};

// Request metadata (cache-busting version id + consumer tag) as a plugin.
const withDecoratorMeta = (): Plugin => (next) => (url, init) => {
    const u = resolveUrl(url);
    u.searchParams.set(VERSION_ID_PARAM, env("VERSION_ID"));
    u.searchParams.set("consumer", CONSUMER);
    return next(u.toString(), init);
};

export const decoratorApi = corgi.create({
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
