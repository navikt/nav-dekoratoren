import { readdir, stat } from 'node:fs/promises';

import { validateParams } from './validateParams';
import { getMockSession, refreshToken } from './mockAuth';
import ContentService from './content-service';

import renderIndex from './render-index';

import varslerMock from './varsler-mock.json';
import SearchService from './search-service';

const requestHandler = async (
  contentService: ContentService,
  searchService: SearchService,
) => {
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

  const validParams = (request: Request) => {
    const url = new URL(request.url);
    const query = Object.fromEntries(url.searchParams);

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
      data: validParams(request),
      url: url.toString(),
      query,
    });
  };

  const myPageMenu = async (request: Request) =>
    contentService.getMyPageMenu({
      language: validParams(request).language,
    });

  const headerMenuLinks = async (request: Request) => {
    const data = validParams(request);
    return contentService.getHeaderMenuLinks({
      language: data.language,
      context: data.context,
    });
  };

  const getResponse = async (request: Request) => {
    const url = new URL(request.url);

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
          if (request.method === 'POST') {
            return new Response(JSON.stringify(await request.json()), {
              headers: { 'content-type': 'application/json; charset=utf-8' },
            });
          } else {
            return new Response('Not found', { status: 404 });
          }
        case '/api/isReady':
          return 'OK';
        case '/api/isAlive':
          return 'OK';
        case '/api/driftsmeldinger':
          return contentService.getDriftsmeldinger();
        case '/api/sok':
          return searchService.search(url.searchParams.get('ord') ?? '');
        case '/data/myPageMenu':
          return myPageMenu(request);
        case '/data/headerMenuLinks':
          return headerMenuLinks(request);
        case '/':
          return new Response(await index(request), {
            headers: { 'content-type': 'text/html; charset=utf-8' },
          });
        default:
          return new Response('Not found', { status: 404 });
      }
    }
  };

  return async function fetch(request: Request): Promise<Response> {
    const response = await getResponse(request);

    switch (response?.constructor?.name) {
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
  };
};

export default requestHandler;
