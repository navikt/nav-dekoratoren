import { NotificationsEmpty } from './views/notifications/notifications-empty';
import { validateParams } from './validateParams';
import { getMockSession, refreshToken } from './mockAuth';
import ContentService from './content-service';

import renderIndex from './render-index';

import SearchService from './search-service';
import {
  Notification,
  Notifications,
} from './views/notifications/notifications';
import { texts } from './texts';
import { Texts } from 'decorator-shared/types';
import UnleashService from './unleash-service';
import TaConfigService from './task-analytics-service';
import { HandlerBuilder, jsonResponse } from './lib/handler';
import { cspHandler } from './csp';
import { env } from './env/server';
import { SearchHits } from './views/search-hits';
import { MainMenu } from './views/header/main-menu';
import { Context, Language } from 'decorator-shared/params';
import { OpsMessages } from './views/ops-messages';

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
  unleashService: UnleashService,
  taConfigService: TaConfigService,
) => {
  const filePaths = fileSystemService
    .getFilePaths('./public')
    .map((file) => file.replace('./', '/'));

  const validParams = (query: Record<string, string>) => {
    const validParams = validateParams(query);
    if (!validParams.success) {
      console.error(validParams.error);
      throw new Error(validParams.error.toString());
    }

    return validParams.data;
  };

  const handlers = new HandlerBuilder()
    .use(
      filePaths.map((path) => ({
        method: 'GET',
        path,
        handler: ({ url }) =>
          // @ts-expect-error Blob type inconsistency
          new Response(fileSystemService.getFile(`.${url.pathname}`)),
      })),
    )
    .get('/api/auth', () =>
      jsonResponse({
        authenticated: true,
        name: 'LOKAL MOCK',
        securityLevel: '4',
      }),
    )
    .get('/api/ta', () => jsonResponse(taConfigService.getTaConfig()))
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
    .get('/api/notifications', async ({ query }) => {
      // throw new Error('woops!');

      const notifications = await notificationsService.getNotifications(
        texts[validParams(query).language],
      );

      const localTexts = texts[validParams(query).language];

      return new Response(
        notifications
          ? Notifications({
              texts: localTexts,
              notifications,
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
    .get('/api/search', async ({ query }) => {
      const searchQuery = query.q;
      const results = await searchService.search(searchQuery);

      return new Response(
        SearchHits({
          results,
          query: searchQuery,
          texts: texts[validParams(query).language],
        }).render(),
        {
          headers: { 'content-type': 'text/html; charset=utf-8' },
        },
      );
    })
    .get('/data/myPageMenu', ({ query }) =>
      jsonResponse(
        contentService.getMyPageMenu({
          language: validParams(query).language,
        }),
      ),
    )
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
    .get(
      '/ops-messages',
      async () =>
        new Response(
          OpsMessages({
            opsMessages: await contentService.getOpsMessages(),
          }).render(),
          {
            headers: { 'content-type': 'text/html; charset=utf-8' },
          },
        ),
    )
    .get('/', async ({ url, query }) => {
      const index = await renderIndex({
        contentService,
        unleashService,
        data: validParams(query),
        url: url.toString(),
        query,
      });
      return rewriter.transform(
        new Response(index, {
          headers: { 'content-type': 'text/html; charset=utf-8' },
        }),
      );
    })
    .use([cspHandler])
    .build();

  return async function fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    const handler = handlers.find(
      ({ method, path }) => request.method === method && url.pathname === path,
    );

    if (handler) {
      return handler.handler({
        request,
        url,
        query: Object.fromEntries(url.searchParams),
      });
    } else {
      return new Response('Not found', { status: 404 });
    }
  };
};

export default requestHandler;
