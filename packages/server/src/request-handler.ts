import { Context, Language } from 'decorator-shared/params';
import { Texts } from 'decorator-shared/types';
import { LogoutIcon } from 'decorator-shared/views/icons/logout';
import { getLogOutUrl } from 'decorator-shared/auth';

import ContentService from './content-service';
import { handleCors } from './cors';
import { cspHandler } from './csp';
import { env } from './env/server';
import { assetsHandlers } from './handlers/assets-handler';
import { HandlerBuilder, r } from './lib/handler';
import { getMockSession, refreshToken } from './mockAuth';
import renderIndex from './render-index';
import SearchService from './search-service';
import TaConfigService from './task-analytics-service';
import { texts } from './texts';
import UnleashService, { GetFeatures } from './unleash-service';
import { validParams } from './validateParams';
import { MainMenu } from './views/header/main-menu';
import { UserMenuDropdown } from './views/header/user-menu-dropdown';
import { IconButton } from './views/icon-button';
import { Notification } from './views/notifications/notifications';
import { OpsMessages } from './views/ops-messages';
import { SearchHits } from './views/search-hits';
import { SimpleUserMenu } from './views/simple-user-menu';
import { SimpleHeader } from './views/header/simple-header';
import { ComplexHeader } from './views/header/complex-header';
import { DecoratorUtils } from './views/decorator-utils';
import { makeContextLinks } from 'decorator-shared/context';
import { SimpleFooter } from './views/footer/simple-footer';
import { ComplexFooter } from './views/footer/complex-footer';
import { ArbeidsgiverUserMenu } from './views/header/arbeidsgiver-user-menu';
import { match } from 'ts-pattern';

type FileSystemService = {
  getFile: (path: string) => Blob;
  getFilePaths: (dir: string) => string[];
};

type NotificationsService = {
  getNotifications: (texts: Texts) => Promise<Notification[] | undefined>;
};

const rewriter = new HTMLRewriter().on('img', {
  element: (element) => {
    const src = element.getAttribute('src');

    if (src) {
      const url = new URL(src, env.CDN_URL);
      element.setAttribute('src', url.toString());
    }
  },
});

const frontPageUrl = (context: Context, language: Language) => {
  if (language === 'en') {
    return `${process.env.XP_BASE_URL}/en/home`;
  }

  switch (context) {
    case 'privatperson':
      return `${process.env.XP_BASE_URL}/`;
    case 'arbeidsgiver':
      return `${process.env.XP_BASE_URL}/no/bedrift`;
    case 'samarbeidspartner':
      return `${process.env.XP_BASE_URL}/no/samarbeidspartner`;
  }
};

const requestHandler = async (
  contentService: ContentService,
  searchService: SearchService,
  fileSystemService: FileSystemService,
  notificationsService: NotificationsService,
  unleashService: GetFeatures,
  taConfigService: TaConfigService,
) => {
  const filePaths = fileSystemService
    .getFilePaths('./public')
    .map((file) => file.replace('./', '/'));


  const handlers = new HandlerBuilder()
    .use(
      filePaths.map((path) => ({
        method: 'GET',
        path,
        handler: ({ url }) =>
          new Response(fileSystemService.getFile(`.${url.pathname}`)),
      })),
    )
    .get('/api/auth', () =>
      r()
        .json({
          authenticated: true,
          name: 'Charlie Jensen',
          securityLevel: '3',
        })
        .build(),
    )
    .get('/api/ta', () => r().json(taConfigService.getTaConfig()).build())
    .get('/api/oauth2/session', () => r().json(getMockSession()).build())
    .get('/api/oauth2/session/refresh', () => {
      refreshToken();
      return r().json(getMockSession()).build();
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
    .get('/oauth2/logout', () => r().json(getMockSession()).build())
    .get('/api/isAlive', () => new Response('OK'))
    .get('/api/isReady', () => new Response('OK'))
    .post('/api/notifications/message/archive', async ({ request }) =>
      r().json(request.json()).build(),
    )
    .get('/api/search', async ({ query }) => {
      const searchQuery = query.q;
      const results = await searchService.search(searchQuery);

      return r()
        .html(
          SearchHits({
            results,
            query: searchQuery,
            texts: texts[validParams(query).language],
          }).render(),
        )
        .build();
    })
    .get('/main-menu', async ({ query }) => {
      const data = validParams(query);
      const localTexts = texts[data.language];
      return new Response(
        MainMenu({
          title:
            data.context === 'privatperson'
              ? localTexts.how_can_we_help
              : localTexts[`rolle_${data.context}`],
          frontPageUrl: frontPageUrl(data.context, data.language),
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
          headers: { 'content-type': 'text/html; charset=utf-8' },
        },
      );
    })
    .get('/user-menu', async ({ query }) => {
      const template = async () => {
        const data = validParams(query);
        const localTexts = texts[data.language];
        if (data.simple) {
          return SimpleUserMenu({
            texts: localTexts,
            name: data.name as string,
          });
        } else {
            // What should type be here
            // This should be merged with params.
          const logoutUrl = getLogOutUrl(data);

          return match(data.context)
            .with('privatperson', async () => UserMenuDropdown({
                texts: localTexts,
                name: data.name,
                notifications: await notificationsService.getNotifications(localTexts),
                level: data.level,
                logoutUrl: logoutUrl as string
            }))
            .with('arbeidsgiver', () => ArbeidsgiverUserMenu({
                texts: localTexts,
            }))
            .with('samarbeidspartner', () => IconButton({
                id: 'logout-button',
                Icon: LogoutIcon({}),
                text: localTexts.logout,
            }))
            .exhaustive();
        }
      };

      return template().then((template) => r().html(template.render()).build());
    })
    .get('/ops-messages', async () =>
      r()
        .html(
          OpsMessages({
            opsMessages: await contentService.getOpsMessages(),
          }).render(),
        )
        .build(),
    )
    .get('/header', async ({ query }) => {
      const data = validParams(query);
      const localTexts = texts[data.language];
      const { language, breadcrumbs, availableLanguages, utilsBackground } =
        data;

      const decoratorUtils = DecoratorUtils({
        breadcrumbs,
        availableLanguages,
        utilsBackground,
      });

      return r()
        .html(
          (data.simple || data.simpleHeader
            ? SimpleHeader({
                texts: localTexts,
                decoratorUtils,
              })
            : ComplexHeader({
                texts: localTexts,
                contextLinks: makeContextLinks(env.XP_BASE_URL),
                context: data.context,
                language,
                decoratorUtils,
              })
          ).render(),
        )
        .build();
    })
    .get('/footer', async ({ query }) => {
      const data = validParams(query);
      const localTexts = texts[data.language];
      const features = unleashService.getFeatures();

      return r()
        .html(
          (data.simple || data.simpleFooter
            ? SimpleFooter({
                links: await contentService.getSimpleFooterLinks({
                  language: data.language,
                }),
                texts: localTexts,
                features,
              })
            : ComplexFooter({
                texts: localTexts,
                links: await contentService.getComplexFooterLinks({
                  language: data.language,
                  context: data.context,
                }),
                features,
              })
          ).render(),
        )
        .build();
    })
    .get('/', async ({ url, query }) => {
      const index = await renderIndex({
        contentService,
        unleashService,
        data: validParams(query),
        url: url.toString(),
        query,
      });

      return rewriter.transform(r().html(index).build());
    })
    .use(assetsHandlers)
    .use([cspHandler])
    .build();

  return async function fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/isAlive') {
        return new Response('OK');
    }

    if (url.pathname === '/api/isReady') {
        return new Response('OK');
    }

    // Ambigious naming since it also returns headers, should be refactored?
    const corsRes = handleCors(request);

    if (corsRes.kind === 'cors-error') {
      return corsRes.response;
    }

    const handler = handlers.find(
      ({ method, path }) => request.method === method && url.pathname === path,
    );

    if (!handler) {
      return new Response('Not found', { status: 404 });
    }

    const response = await handler.handler({
      request,
      url,
      query: Object.fromEntries(url.searchParams),
    });

    for (const [h, v] of Object.entries(corsRes.headers)) {
      if (response.headers.has(h)) {
        throw new Error(`Handler is trying to directly ${h} set with ${v}`);
      }
      response.headers.append(h, v);
    }

    return response;
  };
};

export default requestHandler;
