import { Server } from "bun";
import { makeFrontpageUrl } from "decorator-shared/urls";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { HTTPException } from "hono/http-exception";
import { cspDirectives } from "./content-security-policy";
import { clientEnv, env } from "./env/server";
import { clientStateHandler } from "./handlers/client-state-handler";
import { searchHandler } from "./handlers/search-handler";
import { headers } from "./headers";
import i18n from "./i18n";
import { getMainMenuLinks, mainMenuContextLinks } from "./menu/main-menu";
import { setupMocks } from "./mocks";
import { archiveNotification } from "./notifications";
import { fetchOpsMessages } from "./ops-msgs";
import renderIndex, { renderFooter, renderHeader } from "./render-index";
import { getTaskAnalyticsConfig } from "./task-analytics-config";
import { getFeatures } from "./unleash";
import { validParams } from "./validateParams";
import { csrAssets } from "./views";
import { MainMenu } from "./views/header/main-menu";
import { texts } from "./texts";
import { clientTextsKeys } from "decorator-shared/types";

const app = new Hono({
    strict: false,
});

if (env.NODE_ENV === "development" || env.IS_LOCAL_PROD) {
    console.log("Setting up mocks");
    setupMocks();
    app.get(
        "/mockServiceWorker.js",
        serveStatic({ path: "./public/mockServiceWorker.js" }),
    );
}

app.use(headers);

app.get("/public/assets/*", serveStatic({}));

app.get("/api/isAlive", ({ text }) => text("OK"));
app.get("/api/isReady", ({ text }) => text("OK"));
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
                    : i18n(`rolle_${data.context}`),
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
app.get("/client-state", async ({ req, json }) =>
    json(
        await clientStateHandler({
            params: validParams(req.query()),
            cookie: req.header("Cookie") ?? "",
        }),
    ),
);
app.get("/ops-messages", async ({ json }) => json(await fetchOpsMessages()));
app.get("/header", async ({ req, html }) => {
    const data = validParams(req.query());

    return html(renderHeader({ data }).render(data));
});
app.get("/footer", async ({ req, html }) => {
    const data = validParams(req.query());

    return html(
        (await renderFooter({ features: getFeatures(), data })).render(data),
    );
});
app.get("/env", async ({ req, json }) => {
    const data = validParams(req.query());
    const features = getFeatures();

    return json({
        header: renderHeader({ data }).render(data),
        footer: (await renderFooter({ data, features })).render(data),
        data: {
            texts: Object.entries(texts[data.language])
                .filter(([key]) => clientTextsKeys.includes(key as any))
                .reduce(
                    (prev, [key, value]) => ({
                        ...prev,
                        [key]: value,
                    }),
                    {},
                ),
            params: data,
            features,
            env: clientEnv,
        },
        scripts: csrAssets.mainScriptsProps,
        css: csrAssets.cssProps,
    });
});
app.get("/:clientWithId{client(.*).js}", async ({ redirect }) =>
    redirect(csrAssets.csrScriptUrl),
);
app.get("/css/:clientWithId{client(.*).css}", async ({ redirect }) =>
    redirect(csrAssets.cssUrl),
);
app.get("/", async ({ req, html }) => {
    const data = validParams(req.query());

    return html(
        await renderIndex({
            data,
            texts: texts[data.language],
            url: req.url,
        }),
    );
});

app.route("/decorator-next", app);
app.route("/dekoratoren", app);
app.route("/common-html/v4/navno", app);

export default {
    ...app,
    port: Number(process.env.PORT) || 8089,
} satisfies Partial<Server>;
