import { Server } from "bun";
import { makeFrontpageUrl } from "decorator-shared/urls";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { HTTPException } from "hono/http-exception";
import { cspDirectives } from "./content-security-policy";
import { env } from "./env/server";
import { authHandler } from "./handlers/auth-handler";
import { headers } from "./handlers/headers";
import { searchHandler } from "./handlers/search-handler";
import { versionProxyHandler } from "./handlers/version-proxy";
import i18n from "./i18n";
import { getMainMenuLinks, mainMenuContextLinks } from "./menu/main-menu";
import { setupMocks } from "./mocks";
import { archiveNotification } from "./notifications";
import { fetchOpsMessages } from "./ops-msgs";
import { getTaskAnalyticsConfig } from "./task-analytics-config";
import { getFeatures } from "./unleash";
import { validParams } from "./validateParams";
import { IndexTemplate } from "./views";
import { MainMenu } from "./views/header/main-menu";
import { prometheus } from "@hono/prometheus";
import { HeaderTemplate } from "./views/header/header";
import { FooterTemplate } from "./views/footer/footer";
import { buildDecoratorData, ScriptsTemplate } from "./views/scripts";
import { StylesTemplate } from "./views/styles";
import { csrAssets } from "./csr";
import { CsrPayload } from "decorator-shared/types";
import { HeadAssetsTemplate } from "./head";

const startupTime = Date.now();

const app = new Hono({
    strict: false,
});

app.use(headers);

if (env.NODE_ENV === "development" || env.IS_LOCAL_PROD) {
    console.log("Setting up mocks");
    setupMocks();
    app.get(
        "/mockServiceWorker.js",
        serveStatic({ path: "./mockServiceWorker.js" }),
    );
    app.get("/public/*", serveStatic({}));
    app.get("/api/oauth2/session", async ({ req }) => fetch(req.url));
    app.get("/api/oauth2/session/refresh", async ({ req }) => fetch(req.url));
}

if (!process.env.IS_INTERNAL_APP) {
    app.use(versionProxyHandler);
}

const { printMetrics, registerMetrics } = prometheus();

app.use("*", registerMetrics);
app.get("/metrics", printMetrics);

app.get("/api/isAlive", ({ text }) => text("OK"));
app.get("/api/isReady", ({ text }) => text("OK"));
app.get("/api/version", ({ json }) =>
    json({ versionId: env.VERSION_ID, started: startupTime }),
);
app.get("/api/ta", async ({ json }) => {
    const result = await getTaskAnalyticsConfig();
    if (result.ok) {
        return json(result.data);
    } else {
        throw new HTTPException(500, {
            message: result.error.message,
            cause: result.error,
        });
    }
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
            ...validParams(req.query()),
            query: req.query("q") ?? "",
        }),
    ),
);
app.get("/api/csp", ({ json }) => json(cspDirectives));
app.get("/main-menu", async ({ req, html }) => {
    const data = validParams(req.query());

    return html(
        MainMenu({
            title:
                data.context === "privatperson"
                    ? i18n("how_can_we_help")
                    : i18n(data.context),
            frontPageUrl: makeFrontpageUrl({
                context: data.context,
                language: data.language,
                baseUrl: env.XP_BASE_URL,
            }),
            links: await getMainMenuLinks({
                language: data.language,
                context: data.context,
            }),
            contextLinks: mainMenuContextLinks({
                context: data.context,
                language: data.language,
                bedrift: data.bedrift,
            }),
        }).render(data),
    );
});
app.get("/auth", async ({ req, json }) =>
    json(
        await authHandler({
            params: validParams(req.query()),
            cookie: req.header("Cookie") ?? "",
        }),
    ),
);
app.get("/ops-messages", async ({ json }) => json(await fetchOpsMessages()));
app.get("/header", async ({ req, html }) => {
    const params = validParams(req.query());

    return html(
        HeaderTemplate({ params, withContainers: false }).render(params),
    );
});
app.get("/footer", async ({ req, html }) => {
    const params = validParams(req.query());

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
app.get("/ssr", async ({ req, json }) => {
    const params = validParams(req.query());
    const features = getFeatures();

    return json({
        header: HeaderTemplate({
            params,
            withContainers: true,
        }).render(params),
        footer: (
            await FooterTemplate({
                params,
                features,
                withContainers: true,
            })
        ).render(params),
        scripts: ScriptsTemplate({ features, params }).render(params),
        styles: StylesTemplate().render(),
        headAssets: HeadAssetsTemplate().render(),
    });
});
// /env is used for CSR
// TODO: The CSR implementation can probably be tweaked to use the same data as /ssr
app.get("/env", async ({ req, json }) => {
    const params = validParams(req.query());
    const features = getFeatures();

    return json({
        header: HeaderTemplate({
            params,
            withContainers: true,
        }).render(params),
        footer: (
            await FooterTemplate({
                params,
                features,
                withContainers: true,
            })
        ).render(params),
        data: buildDecoratorData({ params, features }),
        scripts: csrAssets.mainScripts,
        //TODO: Add css?
    } satisfies CsrPayload);
});
app.get("/:clientWithId{client(.*).js}", async ({ redirect }) =>
    redirect(csrAssets.csrScriptUrl),
);
app.get("/css/:clientWithId{client(.*).css}", async ({ redirect }) =>
    redirect(csrAssets.cssUrl),
);
app.get("/", async ({ req, html }) => {
    const params = validParams(req.query());

    return html(
        (
            await IndexTemplate({
                params,
                url: req.url,
            })
        ).render(params),
    );
});

app.route("/decorator-next", app);
app.route("/dekoratoren", app);
app.route("/common-html/v4/navno", app);

export default {
    ...app,
    port: Number(process.env.PORT) || 8089,
} satisfies Partial<Server>;
