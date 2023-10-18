import ContentService from "./content-service";
import { HandlerBuilder, jsonResponse } from "./lib/handler";
import { getMockSession, refreshToken } from "./mockAuth";
import { NotificationsService } from "./request-handler";
import TaConfigService from "./task-analytics-service";
import { validateParams } from "./validateParams";
import { texts } from './texts';
import { Notifications } from "./views/notifications/notifications";
import { NotificationsEmpty } from "decorator-shared/views/notifications/empty";
import SearchService from "./search-service";
import UnleashService from "./unleash-service";
import renderIndex from "./render-index";
import { env } from "./env/server";
import { cspHandler } from "./csp";

export type FileSystemService = {
    getFile: (path: string) => Blob;
    getFilePaths: (dir: string) => string[];
};

const rewriter = new HTMLRewriter().on('img', {
    element: (element) => {
        const src = element.getAttribute('src')

        if (src) {
            const url = new URL(src, env.CDN_URL)
            element.setAttribute('src', url.toString())
        }
    }
})

const validParams = (query: Record<string, string>) => {
    const validParams = validateParams(query);
    if (!validParams.success) {
        console.error(validParams.error);
        throw new Error(validParams.error.toString());
    }

    return validParams.data;
};


export const mainRouter = new HandlerBuilder<[], {
    contentService: ContentService,
    taConfigService: TaConfigService,
    notificationsService: NotificationsService,
    searchService: SearchService,
    fileSystemService: FileSystemService,
    unleashService: UnleashService,
    getMockSession: typeof getMockSession,
    refreshToken: typeof refreshToken
}>()
    .use((ctx) => {
        const filePaths = ctx.fileSystemService
            .getFilePaths('./public')
            .map((file) => file.replace('./', '/'));

        console.log(filePaths)

        return filePaths.map((path) => ({
            method: 'GET',
            path,
            handler: ({ url }) =>
                // @ts-expect-error Blob type inconsistency
                new Response(ctx.fileSystemService.getFile(`.${url.pathname}`)),
        }))
    })
    .get('/api/auth', () =>
        jsonResponse({
            authenticated: true,
            name: 'LOKAL MOCK',
            securityLevel: '4',
        }),
    )
    .get('/api/ta', ({ ctx }) => jsonResponse(ctx.taConfigService.getTaConfig()))
    .get('/api/oauth2/session', () => jsonResponse(getMockSession()))
    .get('/api/oauth2/session/refresh', () => {
        refreshToken();
        return jsonResponse(getMockSession());
    })
    .get(
        '/oauth2/login',
        ({ url }) =>
            new Response('', {
                headers: {
                    Location: url.searchParams.get('redirect') ?? '',
                },
                status: 302,
            }),
    )
    .get('/oauth2/logout', () => jsonResponse(getMockSession()))
    .get('/api/isAlive', () => new Response('OK'))
    .get('/api/isReady', () => new Response('OK'))
    .get('/api/notifications', async ({ query, ctx }) => {
        const notificationLists = await ctx.notificationsService.getNotifications(
            texts[validParams(query).language],
        );

        const localTexts = texts[validParams(query).language];

        if (Math.random() > 0.8) {
            return new Response('server error', { status: 500 });
        }

        return new Response(
            notificationLists
                ? Notifications({
                    texts: localTexts,
                    notificationLists,
                }).render()
                : NotificationsEmpty({ texts: localTexts }).render(),
            {
                headers: { 'content-type': 'text/html; charset=utf-8' },
            },
        );
    })

    .post('/api/notifications/message/archive', async ({ request }) =>
        jsonResponse(request.json()),
    )
    .get('/api/driftsmeldinger', ({ ctx }) =>
        jsonResponse(ctx.contentService.getDriftsmeldinger()),
    )
    .get('/api/sok', async ({ url, ctx }) =>
        jsonResponse(ctx.searchService.search(url.searchParams.get('ord') ?? '')),
    )
    .get('/data/myPageMenu', ({ query, ctx }) =>
        jsonResponse(
            ctx.contentService.getMyPageMenu({
                language: validParams(query).language,
            }),
        ),
    )
    .get('/data/headerMenuLinks', ({ query, ctx }) => {
        const data = validParams(query);
        return jsonResponse(
            ctx.contentService.getHeaderMenuLinks({
                language: data.language,
                context: data.context,
            }),
        );
    })
    .get(
        '/',
        async ({ url, query, ctx }) => {
            const index = await renderIndex({
                contentService: ctx.contentService,
                unleashService: ctx.unleashService,
                data: validParams(query),
                url: url.toString(),
                query,
            })

            return rewriter.transform(new Response(index,
                {
                    headers: { 'content-type': 'text/html; charset=utf-8' },
                },
            ))
        }
    )
    .useRouter(cspHandler)

export type RouterPaths = typeof mainRouter.handlers[number]['path']

