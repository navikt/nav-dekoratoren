import { prometheus } from "@hono/prometheus";
import { Server } from "bun";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { HTTPException } from "hono/http-exception";
import { cspDirectives } from "./content-security-policy";
import { env } from "./env/server";
import { authHandler } from "./handlers/auth-handler";
import { headers } from "./handlers/headers";
import { searchHandler } from "./handlers/search-handler";
import { versionProxyHandler } from "./handlers/version-proxy";
import { headAssets } from "./head";
import { setupMocks } from "./mocks";
import { archiveNotification } from "./notifications";
import { fetchOpsMessages } from "./ops-msgs";
import { getTaskAnalyticsSurveys } from "./task-analytics-config";
import { getFeatures } from "./unleash";
import { isLocalhost } from "./urls";
import { parseAndValidateParams } from "./validateParams";
import { IndexHtml } from "./views";
import { HeaderTemplate } from "./views/header/header";
import { FooterTemplate } from "./views/footer/footer";
import { buildDecoratorData } from "./views/scripts";
import { csrAssets } from "./csr";
import { CsrPayload } from "decorator-shared/types";
import { ssrApiHandler } from "./handlers/ssr-api";
import { versionApiHandler } from "./handlers/version-api-handler";
import { MainMenuTemplate } from "./views/header/render-main-menu";

const app = new Hono({
    strict: false,
});

app.use(headers);

if (env.NODE_ENV === "development" || isLocalhost()) {
    console.log("Setting up mocks");
    setupMocks();
    app.get(
        "/mockServiceWorker.js",
        serveStatic({ path: "./mockServiceWorker.js" }),
    );
    app.get("/public/*", serveStatic({}));
    app.get("/api/oauth2/session", async ({ req }) => fetch(req.url));
    app.get("/api/oauth2/session/refresh", async ({ req }) => fetch(req.url));
    app.get("/api/auth", async ({ req }) => fetch(req.url));
}

if (!process.env.IS_INTERNAL_APP) {
    app.use(versionProxyHandler);
}

const { printMetrics, registerMetrics } = prometheus();

app.use("*", registerMetrics);
app.get("/metrics", printMetrics);

app.get("/api/isAlive", ({ text }) => text("OK"));
app.get("/api/isReady", ({ text }) => text("OK"));

app.get("/api/version", versionApiHandler);
app.get("/api/ta", ({ json }) => {
    return json(getTaskAnalyticsSurveys());
});
app.post("/api/notifications/:id/archive", async ({ req, json }) => {
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
app.get("/api/search", async ({ req, html }) =>
    html(
        await searchHandler({
            ...parseAndValidateParams(req.query()),
            query: req.query("q") ?? "",
        }),
    ),
);
app.get("/api/csp", ({ json }) => json(cspDirectives));
app.get("/main-menu", async ({ req, html }) => {
    const data = parseAndValidateParams(req.query());

    return html(
        (
            await MainMenuTemplate({
                data,
            })
        ).render(data),
    );
});
app.get("/auth", async ({ req, json }) =>
    json(
        await authHandler({
            params: parseAndValidateParams(req.query()),
            cookie: req.header("Cookie") ?? "",
        }),
    ),
);
app.get("/ops-messages", async ({ json }) => json(await fetchOpsMessages()));
app.get("/header", async ({ req, html }) => {
    const params = parseAndValidateParams(req.query());

    return html(
        (await HeaderTemplate({ params, withContainers: false })).render(
            params,
        ),
    );
});
app.get("/footer", async ({ req, html }) => {
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
app.get("/ssr", ssrApiHandler);
// TODO: The CSR implementation can probably be tweaked to use the same data as /ssr
app.on("GET", ["/env", "/csr"], async ({ req, json }) => {
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
app.get("/csr/:clientWithId{client(.*).js}", async ({ redirect }) =>
    redirect(csrAssets.csrScriptUrl),
);
app.get("/csr/css/:clientWithId{client(.*).css}", async ({ redirect }) =>
    redirect(csrAssets.cssUrl),
);
app.get("/:clientWithId{client(.*).js}", async ({ redirect }) =>
    redirect(csrAssets.csrScriptUrl),
);
app.get("/css/:clientWithId{client(.*).css}", async ({ redirect }) =>
    redirect(csrAssets.cssUrl),
);

app.get("/", async ({ req, html }) =>
    html(
        IndexHtml({
            rawParams: req.query(),
            url: req.url,
        }),
    ),
);

app.route("/decorator-next", app);
app.route("/dekoratoren", app);
app.route("/common-html/v4/navno", app);

export default {
    ...app,
    port: Number(process.env.PORT) || 8089,
} satisfies Partial<Server>;
