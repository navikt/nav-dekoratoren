import { handleCors } from "./cors";
import { cspHandler } from "./csp";
import { csrHandler } from "./csr";
import { fetchOpsMessages } from "./enonic";
import { env } from "./env/server";
import { assetsHandlers } from "./handlers/assets-handler";
import { authHandler } from "./handlers/auth-handler";
import jsonIndex from "./json-index";
import { HandlerBuilder, responseBuilder } from "./lib/handler";
import renderIndex, { renderFooter, renderHeader } from "./render-index";
import { searchHandler } from "./handlers/search-handler";
import { getTaskAnalyticsConfig } from "./task-analytics-config";
import { texts } from "./texts";
import { getFeatures } from "./unleash";
import { validParams } from "./validateParams";
import { notificationsArchiveHandler } from "./handlers/notifications-archive-handler";
import { mainmenuHandler } from "./handlers/mainmenu-handler";

const rewriter = new HTMLRewriter().on("img", {
    element: (element) => {
        const src = element.getAttribute("src");

        if (src) {
            element.setAttribute("src", `${env.CDN_URL}${src}`);
        }
    },
});

const requestHandler = async () => {
    const handlersBuilder = new HandlerBuilder()
        .get("/api/ta", () =>
            getTaskAnalyticsConfig().then((result) => {
                if (result.ok) {
                    return responseBuilder().json(result.data).build();
                } else {
                    throw result.error;
                }
            }),
        )
        .get("/api/isAlive", () => new Response("OK"))
        .get("/api/isReady", () => new Response("OK"))
        .post("/api/notifications/archive", notificationsArchiveHandler)
        .get("/api/search", searchHandler)
        .get("/main-menu", mainmenuHandler)
        .get("/auth", authHandler)
        .get("/ops-messages", async () => {
            return responseBuilder()
                .json(await fetchOpsMessages())
                .build();
        })
        .get("/header", async ({ query }) => {
            const data = validParams(query);
            const localTexts = texts[data.language];

            const header = renderHeader({
                texts: localTexts,
                data,
            });

            return rewriter.transform(
                responseBuilder().html(header.render()).build(),
            );
        })
        .get("/footer", async ({ query }) => {
            const data = validParams(query);
            const localTexts = texts[data.language];
            const features = getFeatures();
            const footer = await renderFooter({
                features,
                texts: localTexts,
                data,
            });

            return rewriter.transform(
                responseBuilder().html(footer.render()).build(),
            );
        })
        .get("/scripts", async ({ query }) => {
            const json = await jsonIndex({
                data: validParams(query),
            });

            return responseBuilder().json(json).build();
        })
        .get("/", async ({ url, query }) => {
            const index = await renderIndex({
                data: validParams(query),
                url: url.toString(),
            });

            return rewriter.transform(responseBuilder().html(index).build());
        })
        // Build header and footer for SSR
        .use([
            csrHandler({
                features: getFeatures(),
            }),
        ])
        .use(assetsHandlers)
        .use([cspHandler]);

    const handlers = handlersBuilder.build();

    return async function fetch(request: Request): Promise<Response> {
        const url = new URL(request.url.replace("/decorator-next", ""));

        const headers = handleCors(request);

        const handler = handlers.find(
            ({ method, path }) =>
                request.method === method && url.pathname === path,
        );

        if (!handler) {
            return new Response("Not found", { status: 404 });
        }

        const response = await handler.handler({
            request,
            // @ts-expect-error Mismatch of URL lib types
            url: url,
            query: Object.fromEntries(url.searchParams),
        });

        for (const [h, v] of headers.entries()) {
            if (response.headers.has(h)) {
                throw new Error(
                    `Handler is trying to directly ${h} set with ${v}`,
                );
            }
            response.headers.append(h, v);
        }

        return response;
    };
};

export default requestHandler;
