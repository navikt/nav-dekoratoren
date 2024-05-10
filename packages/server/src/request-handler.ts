import { makeFrontpageUrl } from "decorator-shared/urls";
import ContentService from "./content-service";
import { handleCors } from "./cors";
import { cspHandler } from "./csp";
import { csrHandler } from "./csr";
import { env } from "./env/server";
import { assetsHandlers } from "./handlers/assets-handler";
import { authHandler } from "./handlers/auth-handler";
import jsonIndex from "./json-index";
import { HandlerBuilder, responseBuilder } from "./lib/handler";
import { getMockSession, refreshToken } from "./mockAuth";
import renderIndex, { renderFooter, renderHeader } from "./render-index";
import { search } from "./search";
import { getTaConfig } from "./task-analytics-service";
import { texts } from "./texts";
import UnleashService from "./unleash-service";
import { validParams } from "./validateParams";
import { MainMenu } from "./views/header/main-menu";
import { SearchHits } from "./views/search-hits";

type FileSystemService = {
    getFile: (path: string) => Blob;
    getFilePaths: (dir: string) => string[];
};

const rewriter = new HTMLRewriter().on("img", {
    element: (element) => {
        const src = element.getAttribute("src");

        if (src) {
            element.setAttribute("src", `${env.CDN_URL}${src}`);
        }
    },
});

const requestHandler = async (
    contentService: ContentService,
    fileSystemService: FileSystemService,
    unleashService: UnleashService,
) => {
    const handlersBuilder = new HandlerBuilder()
        .get("/api/auth", () =>
            responseBuilder()
                .json({
                    authenticated: true,
                    name: "Charlie Jensen",
                    securityLevel: "3",
                })
                .build(),
        )
        .get("/api/ta", () =>
            getTaConfig().then((result) => {
                if (result.ok) {
                    return responseBuilder().json(result.data).build();
                } else {
                    throw result.error;
                }
            }),
        )
        .get("/api/oauth2/session", () => {
            return new Response(
                JSON.stringify({
                    authenticated: false,
                    name: "",
                    securityLevel: "",
                }),
                {
                    headers: {
                        "content-type": "application/json",
                    },
                },
            );
        })
        .get("/api/oauth2/session/refresh", () => {
            refreshToken();
            return responseBuilder().json(getMockSession()).build();
        })
        .get(
            "/oauth2/login",
            ({ url }) =>
                new Response("", {
                    headers: {
                        Location: url.searchParams.get("redirect") ?? "",
                    },
                    status: 302,
                }),
        )
        .get("/oauth2/logout", () =>
            responseBuilder().json(getMockSession()).build(),
        )
        .get("/api/isAlive", () => new Response("OK"))
        .get("/api/isReady", () => new Response("OK"))
        .post("/api/notifications/message/archive", async ({ request }) =>
            responseBuilder().json(request.json()).build(),
        )
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
                    links: await contentService.getMainMenuLinks({
                        language: data.language,
                        context: data.context,
                    }),
                    contextLinks: await contentService.mainMenuContextLinks({
                        context: data.context,
                        bedrift: data.bedrift,
                    }),
                }).render(),
                {
                    headers: { "content-type": "text/html; charset=utf-8" },
                },
            );
        })
        .get("/auth-data", authHandler)
        .get("/ops-messages", async () => {
            return responseBuilder()
                .json(await contentService.getOpsMessages())
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
                contentService,
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
                contentService,
                unleashService,
                data: validParams(query),
                url: url.toString(),
            });

            return rewriter.transform(responseBuilder().html(index).build());
        })
        // Build header and footer for SSR
        .use([
            csrHandler({
                contentService,
                features: unleashService.getFeatures(),
            }),
        ])
        .use(assetsHandlers)
        .use([cspHandler]);

    // Only serve files in local prod or dev mode
    if (env.IS_LOCAL_PROD || env.NODE_ENV === "development") {
        const filePaths = fileSystemService
            .getFilePaths("./public")
            .map((file) => file.replace("./", "/"));

        handlersBuilder.use(
            filePaths.map((path) => ({
                method: "GET",
                path,
                handler: ({ url }) =>
                    new Response(fileSystemService.getFile(`.${url.pathname}`)),
            })),
        );
    }

    const handlers = handlersBuilder.build();

    return async function fetch(request: Request): Promise<Response> {
        const url = new URL(request.url.replace("/decorator-next", ""));

        if (url.pathname === "/api/isAlive") {
            return new Response("OK");
        }

        if (url.pathname === "/api/isReady") {
            return new Response("OK");
        }

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
