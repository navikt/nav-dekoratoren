import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import { html } from '@elysiajs/html';

import { validateParams } from './validateParams';
import mockAuth from './mockAuth';
import { env } from './env/server';
import ContentService from './content-service';

import renderIndex from './render-index';
import { fetchDriftsmeldinger, fetchMenu, fetchSearch } from './enonic';
import mockVarslerHandler from './mockVarsler';

const contentService = new ContentService(fetchMenu);

const port = env.PORT || 8089;

const app = new Elysia()
  .use(cors())
  .use(staticPlugin())
  .use(html())
  .use(mockAuth)
  .use(mockVarslerHandler)
  .get('/api/isReady', () => 'OK')
  .get('/api/isAlive', () => 'OK')
  .get('/api/driftsmeldinger', () => fetchDriftsmeldinger())
  .get('/api/sok', ({ query }) =>
    fetchSearch(query.ord as string).then((results) => ({
      hits: results.hits.slice(0, 5),
      total: results.total,
    })),
  )
  .derive((context) => {
    const validParams = validateParams(context.query);
    if (!validParams.success) {
      console.error(validParams.error);
      throw new Error(validParams.error.toString());
    }
    return {
      data: validParams.data,
    };
  })
  .get('/data/myPageMenu', ({ data }) =>
    contentService.getMyPageMenu({ language: data.language }),
  )
  .get('/data/headerMenuLinks', ({ data }) =>
    contentService.getHeaderMenuLinks({
      language: data.language,
      context: data.context,
    }),
  )
  .get('/', async ({ data, query, request }) =>
    renderIndex({
      contentService,
      data,
      url: request.url,
      query,
    }),
  )
  .listen(port);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
