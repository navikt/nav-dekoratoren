import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import { html } from '@elysiajs/html';

import { validateParams } from './validateParams';
import mockAuth from './mockAuth';
import { env } from './env/server';
import { getHeaderMenuLinks } from './buildDataStructure';
import getMyPageMenu from './my-page-menu';

import renderIndex from './render-index';

const port = env.PORT || 8089;

const app = new Elysia()
  .use(cors())
  .use(staticPlugin())
  .use(html())
  .use(mockAuth)
  .get('/api/isReady', () => 'OK')
  .get('/api/isAlive', () => 'OK')
  .get('/api/driftsmeldinger', () =>
    fetch(`${env.ENONICXP_SERVICES}/no.nav.navno/driftsmeldinger`).then((res) =>
      res.json(),
    ),
  )
  .get('/api/sok', ({ query }) =>
    fetch(
      `${`${env.ENONICXP_SERVICES}/navno.nav.no.search/search2/sok`}?ord=${
        query.ord
      }`,
    )
      .then((res) => res.json())
      .then((results) => ({
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
    fetch(`${process.env.ENONICXP_SERVICES}/no.nav.navno/menu`)
      .then((response) => response.json())
      .then((menu) => getMyPageMenu(menu, data.language)),
  )
  .get('/data/headerMenuLinks', ({ data }) =>
    getHeaderMenuLinks({ language: data.language, context: data.context }),
  )
  .get('/', async ({ data, query, request }) => {
    const menu = await fetch(
      `${process.env.ENONICXP_SERVICES}/no.nav.navno/menu`,
    ).then((response) => response.json());
    return renderIndex({ menu, data, url: request.url, query, port });
  })
  .listen(port);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
