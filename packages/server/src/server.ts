import { readdir, stat } from 'node:fs/promises';

import { validateParams } from './validateParams';
import { getMockSession, refreshToken } from './mockAuth';
import { env } from './env/server';
import ContentService from './content-service';

import renderIndex from './render-index';
import { fetchDriftsmeldinger, fetchMenu, fetchSearch } from './enonic';

import varslerMock from './varsler-mock.json';

const contentService = new ContentService(fetchMenu);

const port = env.PORT || 8089;

const getFiles = async (dir: string): Promise<string[]> => {
  const files = await readdir(dir);
  return Promise.all(
    files.map(async (name) => {
      const file = dir + '/' + name;
      const stats = await stat(file);

      return stats.isDirectory() ? await getFiles(file) : file;
    }),
  ).then((all) => all.flat());
};

const files = (await getFiles('./public')).map((file) =>
  file.replace('./', '/'),
);

const validParams = (query: { [k: string]: string }) => {
  const validParams = validateParams(query);
  if (!validParams.success) {
    console.error(validParams.error);
    throw new Error(validParams.error.toString());
  }
  return validParams.data;
};

const index = async (request: Request) => {
  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams);

  return renderIndex({
    contentService,
    data: validParams(query),
    url: url.toString(),
    query,
  });
};

const myPageMenu = async (request: Request) =>
  contentService.getMyPageMenu({
    language: validParams(Object.fromEntries(new URL(request.url).searchParams))
      .language,
  });

const headerMenuLinks = async (request: Request) => {
  const data = validParams(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  return contentService.getHeaderMenuLinks({
    language: data.language,
    context: data.context,
  });
};

Bun.serve({
  port,
  development: process.env.NODE_ENV === 'development',
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    const getResponse = async (request: Request) => {
      if (files.includes(url.pathname)) {
        return Bun.file(`.${url.pathname}`);
      } else {
        switch (url.pathname) {
          case '/api/auth':
            return {
              authenticated: true,
              name: 'LOKAL MOCK',
              securityLevel: '4',
            };
          case '/api/oauth2/session':
            return getMockSession();
          case '/api/oauth2/session/refresh':
            refreshToken();
            return getMockSession();
          case '/oauth2/login':
            return new Response('', {
              headers: {
                Location: url.searchParams.get('redirect') ?? '',
              },
              status: 302,
            });
          case '/oauth2/logout':
            return getMockSession();
          case '/api/varsler':
            return {
              beskjeder: varslerMock.beskjeder.slice(0, 6),
              oppgaver: varslerMock.oppgaver.slice(0, 3),
            };
          case '/api/varsler/beskjed/inaktiver':
            return await request.json();
          case '/api/isReady':
            return 'OK';
          case '/api/isAlive':
            return 'OK';
          case '/api/driftsmeldinger':
            return await fetchDriftsmeldinger();
          case '/api/sok':
            return await fetchSearch(
              url.searchParams.get('ord') as string,
            ).then((results) => ({
              hits: results.hits.slice(0, 5),
              total: results.total,
            }));
          case '/data/myPageMenu':
            return await myPageMenu(request);
          case '/data/headerMenuLinks':
            return await headerMenuLinks(request);
          case '/':
            return new Response(await index(request), {
              headers: { 'content-type': 'text/html; charset=utf-8' },
            });
          default:
            return new Response('Not found', { status: 404 });
        }
      }
    };

    const response = await getResponse(request);

    switch (response.constructor.name) {
      case 'Response':
        return response as Response;
      case 'String':
      case 'Blob':
        return new Response(response as string | Blob);
      case 'Object':
      case 'Array':
      default:
        return new Response(JSON.stringify(response), {
          headers: { 'content-type': 'application/json; charset=utf-8' },
        });
    }
  },
});

console.log(`decorator-next is running at http://localhost:${port}`);
