import { makeFrontpageUrl } from "decorator-shared/urls";
import { getMainMenuLinks, mainMenuContextLinks } from "./menu";
import { handleCors } from "./cors";
import { cspHandler } from "./csp";
import { csrHandler } from "./csr";
import { fetchOpsMessages } from "./enonic";
import { env } from "./env/server";
import { assetsHandlers } from "./handlers/assets-handler";
import { authHandler } from "./handlers/auth-handler";
import jsonIndex from "./json-index";
import { HandlerBuilder, responseBuilder } from "./lib/handler";
import { archiveNotification } from "./notifications";
import renderIndex, { renderFooter, renderHeader } from "./render-index";
import { searchHandler } from "./handlers/search-handler";
import { getTaskAnalyticsConfig } from "./task-analytics-config";
import { texts } from "./texts";
import UnleashService from "./unleash-service";
import { validParams } from "./validateParams";
import { MainMenu } from "./views/header/main-menu";

const rewriter = new HTMLRewriter().on("img", {
    element: (element) => {
        const src = element.getAttribute("src");

        if (src) {
            element.setAttribute("src", `${env.CDN_URL}${src}`);
        }
    },
});

const requestHandler = async (unleashService: UnleashService) => {
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
        .post("/api/notifications/archive", async ({ request, query }) => {
            const result = await archiveNotification({
                request,
                id: query.id,
            });
            if (result.ok) {
                return responseBuilder().json(result.data).build();
            } else {
                return responseBuilder()
                    .status(500)
                    .json({ error: result.error.message })
                    .build();
            }
        })
        .get("/api/search", async ({ query }) => {
            const searchQuery = query.q;
            const results = await search({
                query: searchQuery,
                ...validParams(query),
            });

            return responseBuilder()
                .html(
                    SearchHits({
                        results,
                        query: searchQuery,
                        texts: texts[validParams(query).language],
                    }).render(),
                )
                .build();
        })
        .get("/api/search", searchHandler)
        .get("/main-menu", async ({ query }) => {
            const data = validParams(query);
            const localTexts = texts[data.language];

            const frontPageUrl = makeFrontpageUrl({
                context: data.context,
                language: data.language,
                baseUrl: env.XP_BASE_URL,
            });

            return new Response(
                MainMenu({
                    title:
                        data.context === "privatperson"
                            ? localTexts.how_can_we_help
                            : localTexts[`rolle_${data.context}`],
                    frontPageUrl,
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
                {
                    headers: { "content-type": "text/html; charset=utf-8" },
                },
            );
        })
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
            const features = unleashService.getFeatures();
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
                unleashService,
                data: validParams(query),
            });

            return responseBuilder().json(json).build();
        })
        .get("/", async ({ url, query }) => {
            const index = await renderIndex({
                unleashService,
                data: validParams(query),
                url: url.toString(),
            });

            return rewriter.transform(responseBuilder().html(index).build());
        })
        // Build header and footer for SSR
        .use([
            csrHandler({
                features: unleashService.getFeatures(),
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
