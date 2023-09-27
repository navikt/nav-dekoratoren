import { validateParams } from './validateParams';
import { getMockSession, refreshToken } from './mockAuth';
import ContentService from './content-service';

import renderIndex from './render-index';

import notificationsMock from './notifications-mock.json';
import SearchService from './search-service';
import { Notification, NotificationsPopulated } from './views/notifications';

type FileSystemService = {
  getFile: (path: string) => Blob;
  getFilePaths: (dir: string) => string[];
};

const requestHandler = async (
  contentService: ContentService,
  searchService: SearchService,
  fileSystemService: FileSystemService,
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

  type HandlerFunction = ({
    request,
    url,
    query,
  }: {
    request: Request;
    url: URL;
    query: Record<string, string>;
  }) => Response | Promise<Response>;

  type Handler = {
    method: string;
    path: string;
    handler: HandlerFunction;
  };

  class HandlerBuilder {
    handlers: Handler[] = [];

    get(path: string, handler: HandlerFunction): HandlerBuilder {
      this.handlers.push({ method: 'GET', path, handler });
      return this;
    }

    post(path: string, handler: HandlerFunction): HandlerBuilder {
      this.handlers.push({ method: 'POST', path, handler });
      return this;
    }

    use(handlers: Handler[]): HandlerBuilder {
      this.handlers = [...this.handlers, ...handlers];
      return this;
    }

    build() {
      return this.handlers;
    }
  }

  const jsonResponse = async (data: unknown) =>
    new Response(JSON.stringify(await data), {
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });

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
      jsonResponse({
        authenticated: true,
        name: 'LOKAL MOCK',
        securityLevel: '4',
      }),
    )
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
    .get(
      '/api/notifications',
      ({ query }) =>
        new Response(
          NotificationsPopulated({
            texts: contentService.getTexts({
              language: validParams(query).language,
            }),
            notificationsData: {
              beskjeder: notificationsMock.beskjeder.slice(
                0,
                6,
              ) as Notification[],
              oppgaver: notificationsMock.oppgaver.slice(
                0,
                3,
              ) as Notification[],
            },
          }),
          {
            headers: { 'content-type': 'text/html; charset=utf-8' },
          },
        ),
    )
    .post('/api/notifications/message/archive', async ({ request }) =>
      jsonResponse(request.json()),
    )
    .get('/api/driftsmeldinger', () =>
      jsonResponse(contentService.getDriftsmeldinger()),
    )
    .get('/api/sok', async ({ url }) =>
      jsonResponse(searchService.search(url.searchParams.get('ord') ?? '')),
    )
    .get('/data/myPageMenu', ({ query }) =>
      jsonResponse(
        contentService.getMyPageMenu({
          language: validParams(query).language,
        }),
      ),
    )
    .get('/data/headerMenuLinks', ({ query }) => {
      const data = validParams(query);
      return jsonResponse(
        contentService.getHeaderMenuLinks({
          language: data.language,
          context: data.context,
        }),
      );
    })
    .get(
      '/',
      async ({ url, query }) =>
        new Response(
          await renderIndex({
            contentService,
            data: validParams(query),
            url: url.toString(),
            query,
          }),
          {
            headers: { 'content-type': 'text/html; charset=utf-8' },
          },
        ),
    )
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
