import { Server } from "bun";
import { makeFrontpageUrl } from "decorator-shared/urls";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { cspDirectives } from "./content-security-policy";
import { clientEnv, env } from "./env/server";
import { authHandler } from "./handlers/auth-handler";
import { searchHandler } from "./handlers/search-handler";
import { headers } from "./headers";
import { getMainMenuLinks, mainMenuContextLinks } from "./menu/main-menu";
import { setupMocks } from "./mocks";
import { archiveNotification } from "./notifications";
import { fetchOpsMessages } from "./ops-msgs";
import renderIndex, { renderFooter, renderHeader } from "./render-index";
import { getTaskAnalyticsConfig } from "./task-analytics-config";
import { texts } from "./texts";
import { getFeatures } from "./unleash";
import { validParams } from "./validateParams";
import { getClientSideRenderingScriptUrl, getCss, getScripts } from "./views";
import { MainMenu } from "./views/header/main-menu";

if (env.NODE_ENV === "development") {
    console.log("Setting up mocks");
    setupMocks();
}

const app = new Hono();

app.use(headers);

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
    const localTexts = texts[data.language];

    return html(
        MainMenu({
            title:
                data.context === "privatperson"
                    ? localTexts.how_can_we_help
                    : localTexts[`rolle_${data.context}`],
            frontPageUrl: makeFrontpageUrl({
                context: data.context,
                language: data.language,
                baseUrl: env.XP_BASE_URL,
            }),
            texts: localTexts,
            links: await getMainMenuLinks({
                language: data.language,
                context: data.context,
            }),
            contextLinks: await mainMenuContextLinks({
                context: data.context,
                bedrift: data.bedrift,
            }),
        }).render(),
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
    const data = validParams(req.query());

    return html(
        renderHeader({
            texts: texts[data.language],
            data,
        }).render(),
    );
});
app.get("/footer", async ({ req, html }) => {
    const data = validParams(req.query());

    return html(
        (
            await renderFooter({
                features: getFeatures(),
                texts: texts[data.language],
                data,
            })
        ).render(),
    );
});
app.get("/env", async ({ req, json }) => {
    const data = validParams(req.query());
    const features = getFeatures();

    return json({
        header: renderHeader({
            data,
            texts: texts[data.language],
        }).render(),
        footer: (
            await renderFooter({
                data,
                texts: texts[data.language],
                features,
            })
        ).render(),
        data: {
            texts,
            params: data,
            features,
            env: clientEnv,
        },
        scripts: await getScripts(),
        //TODO: Add css
    });
});
app.get("/client.js", async ({ redirect }) =>
    redirect(await getClientSideRenderingScriptUrl()),
);
app.get("/css/client.css", async ({ redirect }) =>
    redirect((await getCss())[0]),
);
app.get("/", async ({ req, html }) =>
    html(
        await renderIndex({
            data: validParams(req.query()),
            url: req.url,
        }),
    ),
);

app.route("/decorator-next", app);

export default {
    ...app,
    port: Number(process.env.PORT) || 8089,
} satisfies Partial<Server>;
