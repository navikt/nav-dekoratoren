import { makeFrontpageUrl } from "decorator-shared/urls";
import { Hono } from "hono";
import { fetchOpsMessages } from "./enonic";
import { clientEnv, env } from "./env/server";
import { authHandler } from "./handlers/auth-handler";
import { searchHandler } from "./handlers/search-handler";
import { headers } from "./headers";
import jsonIndex from "./json-index";
import { getMainMenuLinks, mainMenuContextLinks } from "./menu";
import { setupMocks } from "./mocks";
import { archiveNotification } from "./notifications";
import renderIndex, { renderFooter, renderHeader } from "./render-index";
import { getTaskAnalyticsConfig } from "./task-analytics-config";
import { texts } from "./texts";
import { getFeatures } from "./unleash";
import { validParams } from "./validateParams";
import { cdnUrl, getManifest } from "./views";
import { MainMenu } from "./views/header/main-menu";
import { cspDirectives } from "./content-security-policy";

if (env.NODE_ENV === "development") {
    console.log("Setting up mocks");
    setupMocks();
}

export const app = new Hono();

app.use(headers);

app.get("/api/isAlive", (c) => c.text("OK"));
app.get("/api/isReady", (c) => c.text("OK"));
app.get("/api/ta", async (c) => {
    const result = await getTaskAnalyticsConfig();
    if (result.ok) {
        return c.json(result.data);
    } else {
        throw result.error;
    }
});
app.post("/api/notifications/:id/archive", async (c) => {
    const id = c.req.param("id");

    const result = await archiveNotification({
        cookie: c.req.header("cookie") ?? "",
        id,
    });
    if (result.ok) {
        return c.json(result.data);
    } else {
        return c.json({ error: result.error.message }).status(500);
    }
});
app.get("/api/search", async (c) =>
    c.html(
        await searchHandler({
            ...validParams(c.req.query()),
            query: c.req.query("q") ?? "",
        }),
    ),
);
app.get("/api/csp", (c) => c.json(cspDirectives));
app.get("/main-menu", async (c) => {
    const data = validParams(c.req.query());
    const localTexts = texts[data.language];

    return c.html(
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
app.get("/auth", async (c) =>
    c.json(
        await authHandler({
            params: validParams(c.req.query()),
            cookie: c.req.header("Cookie") ?? "",
        }),
    ),
);
app.get("/ops-messages", async (c) => c.json(await fetchOpsMessages()));
app.get("/header", async (c) => {
    const data = validParams(c.req.query());

    return c.html(
        renderHeader({
            texts: texts[data.language],
            data,
        }).render(),
    );
});
app.get("/footer", async (c) => {
    const data = validParams(c.req.query());

    return c.html(
        (
            await renderFooter({
                features: getFeatures(),
                texts: texts[data.language],
                data,
            })
        ).render(),
    );
});
app.get("/scripts", async (c) =>
    c.json(await jsonIndex({ data: validParams(c.req.query()) })),
);
app.get("/env", async (c) => {
    const data = validParams(c.req.query());
    const localTexts = texts[data.language];
    const features = getFeatures();

    const header = renderHeader({
        data,
        texts: localTexts,
    });

    const footer$ = renderFooter({
        data,
        texts: localTexts,
        features,
    });

    const manifest$ = getManifest();

    const [footer, manifest] = await Promise.all([footer$, manifest$]);

    const scripts = [cdnUrl(manifest["src/main.ts"].file)];

    return c.json({
        header: header.render(),
        footer: footer.render(),
        data: {
            texts,
            params: data,
            features,
            env: clientEnv,
        },
        scripts,
    });
});
app.get("/client.js", async (c) => {
    const manifest = await getManifest();
    c.redirect(cdnUrl(manifest["src/csr.ts"].file));
});
app.get("/css/client.css", async (c) => {
    const manifest = await getManifest();
    c.redirect(cdnUrl(manifest["src/main.ts"].css[0]));
});
app.get("/", async (c) =>
    c.html(
        await renderIndex({
            data: validParams(c.req.query()),
            url: c.req.url,
        }),
    ),
);

export default app;
