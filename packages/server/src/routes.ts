import { prometheus } from "@hono/prometheus";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { cspDirectives } from "./content-security-policy";
import { logger } from "./lib/logger";
import { env } from "./env/server";
import { authHandler } from "./handlers/auth-handler";
import { headers } from "./handlers/headers";
import { searchHandler } from "./handlers/search-handler";
import { versionProxyHandler } from "./handlers/version-proxy";
import { headAssets } from "./head";
import { setLocalDecoratorMockState, setupMocks } from "./mocks";
import { archiveNotification } from "./notifications";
import { fetchOpsMessages } from "./ops-msgs";
import { getFeatures } from "./unleash";
import { isLocalhost } from "./urls";
import { parseAndValidateParams } from "./validateParams";
import { IndexHtml } from "./views";
import { HeaderTemplate } from "./views/header/header";
import { FooterTemplate } from "./views/footer/footer";
import { csrAssets } from "./csr";
import { CsrPayload } from "decorator-shared/types";
import { ssrApiHandler } from "./handlers/ssr-api";
import { versionApiHandler } from "./handlers/version-api-handler";
import { MainMenuTemplate } from "./views/header/render-main-menu";
import { buildDecoratorData } from "./decorator-data";
import { CONSUMER } from "decorator-shared/constants";
import { consentpingHandler } from "./handlers/consentping-handler";

// Ingresses don't strip the path prefix, so every route must be served under
// each of these. See the ingresses in .nais/vars/*.yml - ingress-prefixes.test.ts
// fails if this list and those files drift apart.
export const INGRESS_PATH_PREFIXES = [
    "/",
    "/dekoratoren",
    "/common-html/v4/navno",
] as const;

const { printMetrics, registerMetrics } = prometheus();

// Endpoints are defined once here, and mounted on each prefix at the bottom.
export const routes = new Hono({
    strict: false,
});

if (env.NODE_ENV === "development" || isLocalhost()) {
    logger.info("Setting up mocks");
    setupMocks();
    routes.get(
        "/mockServiceWorker.js",
        serveStatic({ path: "./mockServiceWorker.js" }),
    );
    routes.get(
        "/public/*",
        serveStatic({
            root: "../client/dist",
            // serveStatic resolves files from c.req.path, and mounting via
            // app.route() does not strip the prefix from it - so under an
            // ingress prefix this receives e.g.
            // "/dekoratoren/public/assets/x.js". Strip everything up to and
            // including "/public". Routing guarantees the path starts with one
            // of INGRESS_PATH_PREFIXES, so the lazy match is bounded.
            rewriteRequestPath: (path) => path.replace(/^.*?\/public/, ""),
        }),
    );
    routes.get("/api/oauth2/session", async ({ req }) => fetch(req.url));
    routes.get("/api/oauth2/session/refresh", async ({ req }) =>
        fetch(req.url),
    );
    routes.get("/api/auth", async ({ req }) => fetch(req.url));
    routes.get("/api/local-decorator-state", ({ req, json, redirect }) => {
        const auth = req.query("auth");
        const notifications = req.query("notifications");
        const returnTo = req.query("returnTo");

        setLocalDecoratorMockState({
            auth:
                auth === "logged-in" || auth === "logged-out"
                    ? auth
                    : undefined,
            notifications:
                notifications === "full" || notifications === "empty"
                    ? notifications
                    : undefined,
        });

        if (returnTo?.startsWith("http://localhost:3000/")) {
            return redirect(returnTo);
        }

        return json({ ok: true });
    });
}

routes.get("/metrics", printMetrics);
routes.get("/api/isAlive", ({ text }) => text("OK"));
routes.get("/api/isReady", ({ text }) => text("OK"));

routes.get("/api/version", versionApiHandler);

routes.post("/api/consentping", consentpingHandler);

routes.post("/api/notifications/:id/archive", async ({ req, json }) => {
    const result = await archiveNotification({
        cookie: req.header("cookie") ?? "",
        id: req.param("id"),
    });
    if (result.ok) {
        return json(result.data);
    } else {
        throw new HTTPException(500, {
            message: result.error.message,
            cause: result.error,
        });
    }
});

routes.get("/api/search", async ({ req, html }) =>
    html(
        await searchHandler({
            ...parseAndValidateParams(req.query()),
            query: req.query("q") ?? "",
        }),
    ),
);

routes.get("/api/csp", ({ json }) => json(cspDirectives));

routes.get("/main-menu", async ({ req, html }) => {
    if (req.query("consumer") !== CONSUMER) {
        return html("");
    }
    const data = parseAndValidateParams(req.query());
    return html(
        (
            await MainMenuTemplate({
                data,
            })
        ).render(data),
    );
});

routes.get("/auth", async ({ req, json }) =>
    json(
        await authHandler({
            params: parseAndValidateParams(req.query()),
            cookie: req.header("Cookie") ?? "",
        }),
    ),
);

routes.get("/ops-messages", async ({ json }) => json(await fetchOpsMessages()));

routes.get("/header", async ({ req, html }) => {
    if (req.query("consumer") !== CONSUMER) {
        return html("");
    }
    const params = parseAndValidateParams(req.query());
    return html(
        (await HeaderTemplate({ params, withContainers: false })).render(
            params,
        ),
    );
});

routes.get("/footer", async ({ req, html }) => {
    if (req.query("consumer") !== CONSUMER) {
        return html("");
    }
    const params = parseAndValidateParams(req.query());
    return html(
        (
            await FooterTemplate({
                features: getFeatures(),
                params,
                withContainers: false,
            })
        ).render(params),
    );
});

routes.get("/ssr", ssrApiHandler);

// TODO: The CSR implementation can probably be tweaked to use the same data as /ssr
routes.on("GET", ["/env", "/csr"], async ({ req, json }) => {
    const query = req.query();
    const params = parseAndValidateParams(query);
    const features = getFeatures();

    return json({
        header: (
            await HeaderTemplate({
                params,
                withContainers: true,
            })
        ).render(params),
        footer: (
            await FooterTemplate({
                params,
                features,
                withContainers: true,
            })
        ).render(params),
        data: buildDecoratorData({
            params,
            rawParams: query,
            features,
            headAssets,
        }),
        scripts: csrAssets.mainScripts,
    } satisfies CsrPayload);
});

routes.get("/csr/:clientWithId{client(.*).js}", async ({ redirect }) =>
    redirect(csrAssets.csrScriptUrl),
);
routes.get("/csr/css/:clientWithId{client(.*).css}", async ({ redirect }) =>
    redirect(csrAssets.cssUrl),
);
routes.get("/:clientWithId{client(.*).js}", async ({ redirect }) =>
    redirect(csrAssets.csrScriptUrl),
);
routes.get("/css/:clientWithId{client(.*).css}", async ({ redirect }) =>
    redirect(csrAssets.cssUrl),
);

routes.get("/", async ({ req, html }) =>
    html(
        IndexHtml({
            rawParams: req.query(),
            url: req.url,
        }),
    ),
);

export const app = new Hono({
    strict: false,
});

// Middleware must be registered before the app.route() calls below - Hono runs
// matching handlers in registration order, so a later use() would never run.
app.use(headers);

if (!process.env.IS_INTERNAL_APP) {
    // Before registerMetrics, so proxied requests aren't counted here.
    app.use(versionProxyHandler);
}

app.use("*", registerMetrics);

INGRESS_PATH_PREFIXES.forEach((prefix) => app.route(prefix, routes));
