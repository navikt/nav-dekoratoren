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

    if (files.includes(url.pathname)) {
      return new Response(Bun.file(`.${url.pathname}`));
    } else {
      switch (url.pathname) {
        case '/api/auth':
          return new Response(
            JSON.stringify({
              authenticated: true,
              name: 'LOKAL MOCK',
              securityLevel: '4',
            }),
            { headers: { 'content-type': 'application/json' } },
          );
        case '/api/oauth2/session':
          return new Response(JSON.stringify(getMockSession()), {
            headers: { 'content-type': 'application/json' },
          });
        case '/api/oauth2/session/refresh':
          refreshToken();
          return new Response(JSON.stringify(getMockSession()), {
            headers: { 'content-type': 'application/json' },
          });
        case '/oauth2/login':
          return new Response('', {
            headers: {
              Location: url.searchParams.get('redirect') ?? '',
            },
            status: 302,
          });
        case '/oauth2/logout':
          return new Response(JSON.stringify(getMockSession()), {
            headers: { 'content-type': 'application/json' },
          });
        case '/api/varsler':
          return new Response(
            JSON.stringify({
              beskjeder: varslerMock.beskjeder.slice(0, 6),
              oppgaver: varslerMock.oppgaver.slice(0, 3),
            }),
            { headers: { 'content-type': 'application/json' } },
          );
        case '/api/varsler/beskjed/inaktiver':
          return new Response(await request.json(), {
            headers: { 'content-type': 'application/json' },
          });
        case '/api/isReady':
          return new Response('OK');
        case '/api/isAlive':
          return new Response('OK');
        case '/api/driftsmeldinger':
          return new Response(await fetchDriftsmeldinger(), {
            headers: { 'content-type': 'application/json' },
          });
        case '/api/sok':
          return new Response(
            JSON.stringify(
              await fetchSearch(url.searchParams.get('ord') as string).then(
                (results) => ({
                  hits: results.hits.slice(0, 5),
                  total: results.total,
                }),
              ),
            ),
            { headers: { 'content-type': 'application/json' } },
          );
        case '/data/myPageMenu':
          return new Response(JSON.stringify(await myPageMenu(request)), {
            headers: { 'content-type': 'application/json' },
          });
        case '/data/headerMenuLinks':
          return new Response(JSON.stringify(await headerMenuLinks(request)), {
            headers: { 'content-type': 'application/json' },
          });
        case '/':
          return new Response(await index(request), {
            headers: { 'content-type': 'text/html' },
          });
        default:
          return new Response('Not found', { status: 404 });
      }
    }
  },
});

console.log(`decorator-next is running at http://localhost:${port}`);
