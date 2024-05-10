import { getLogOutUrl } from "decorator-shared/auth";
import html from "decorator-shared/html";
import { makeFrontpageUrl } from "decorator-shared/urls";
import { LogoutIcon } from "decorator-shared/views/icons/logout";
import { match } from "ts-pattern";
import ContentService from "./content-service";
import { handleCors } from "./cors";
import { cspHandler } from "./csp";
import { csrHandler } from "./csr";
import { clientEnv, env } from "./env/server";
import { assetsHandlers } from "./handlers/assets-handler";
import jsonIndex from "./json-index";
import { HandlerBuilder, responseBuilder } from "./lib/handler";
import { getMockSession, refreshToken } from "./mockAuth";
import { getNotifications } from "./notifications";
import renderIndex, { renderFooter, renderHeader } from "./render-index";
import { search } from "./search";
import TaConfigService from "./task-analytics-service";
import { texts } from "./texts";
import UnleashService from "./unleash-service";
import { validParams } from "./validateParams";
import { ArbeidsgiverUserMenu } from "./views/header/arbeidsgiver-user-menu";
import { MainMenu } from "./views/header/main-menu";
import { UserMenuDropdown } from "./views/header/user-menu-dropdown";
import { AnchorIconButton } from "./views/icon-button";
import { SearchHits } from "./views/search-hits";
import { SimpleUserMenu } from "./views/simple-user-menu";

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
    unleashService: UnleashService,
    taConfigService: TaConfigService,
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
            taConfigService
                .getTaConfig()
                .then((config) => responseBuilder().json(config).build()),
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
        .get("/user-menu", async ({ query, request }) => {
            const template = async () => {
                const data = validParams(query);
                const localTexts = texts[data.language];
                const logoutUrl = getLogOutUrl(data);

                if (data.simple) {
                    return SimpleUserMenu({
                        logoutUrl,
                        texts: localTexts,
                        name: data.name as string,
                    });
                } else {
                    // What should type be here
                    // This should be merged with params.
                    const logoutUrl = getLogOutUrl(data);

                    // @TODO: Tests for important urls, like logout
                    return match(data.context)
                        .with("privatperson", async () => {
                            const result = await getNotifications({
                                request,
                            });
                            if (!result.ok) {
                                return html`<div>Error</div>`;
                            }
                            return UserMenuDropdown({
                                texts: localTexts,
                                name: data.name,
                                notifications: result.data,
                                level: data.level,
                                logoutUrl: logoutUrl as string,
                                minsideUrl: clientEnv.MIN_SIDE_URL,
                                personopplysningerUrl:
                                    clientEnv.PERSONOPPLYSNINGER_URL,
                            });
                        })
                        .with("arbeidsgiver", () =>
                            ArbeidsgiverUserMenu({
                                texts: localTexts,
                                href: clientEnv.MIN_SIDE_ARBEIDSGIVER_URL,
                            }),
                        )
                        .with("samarbeidspartner", () =>
                            AnchorIconButton({
                                Icon: LogoutIcon({}),
                                href: logoutUrl,
                                text: localTexts.logout,
                            }),
                        )
                        .exhaustive();
                }
            };

            return template().then((template) =>
                responseBuilder().html(template.render()).build(),
            );
        })
        .get("/ops-messages", async () => {
            return responseBuilder()
                .json(await contentService.getOpsMessages())
                .build();
        })
        .get("/header", async ({ query }) => {
            const data = validParams(query);
            const localTexts = texts[data.language];

            const header = await renderHeader({
                texts: localTexts,
                data,
                contentService,
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
                query,
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
