import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import { html } from '@elysiajs/html';

import { DecoratorEnv } from './views/decorator-env';
import { DecoratorLens } from './views/decorator-lens';
import { Footer } from './views/footer';
import { Header } from 'decorator-shared/views/header';
import { validateParams } from './validateParams';
import mockAuth from './mockAuth';
import { env } from './env/server';
import buildDataStructure, { getHeaderMenuLinks } from './buildDataStructure';
import getMyPageMenu from './my-page-menu';
import { Index } from './views';

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
    const dataStructure = await buildDataStructure(data);
    const resources = await getResources();

    return Index({
      scripts: resources.scripts,
      links: resources.styles,
      language: data.language,
      header: Header({
        texts: dataStructure.texts,
        mainMenu: dataStructure.mainMenu,
        headerMenuLinks: dataStructure.headerMenuLinks,
        innlogget: false,
        isNorwegian: true,
        breadcrumbs: data.breadcrumbs,
        utilsBackground: data.utilsBackground,
        availableLanguages: data.availableLanguages,
        myPageMenu: dataStructure.myPageMenu,
        simple: data.simple,
      }),
      footer: Footer({
        texts: dataStructure.texts,
        personvern: dataStructure.personvern,
        footerLinks: dataStructure.footerLinks,
        simple: data.simple,
        feedback: data.feedback,
      }),
      env: DecoratorEnv({
        origin: request.url,
        env: data,
      }),
      lens: DecoratorLens({
        origin: request.url,
        env: data,
        query,
      }),
    });
  })
  .listen(port);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);

const getResources = async () => {
  const entryPointPath = 'src/main.ts';

  const host = process.env.HOST ?? `http://localhost:${port}`;
  const script = (src: string) =>
    `<script type="module" src="${src}"></script>`;

  const resources = (
    (
      await import('decorator-client/dist/manifest.json', {
        assert: { type: 'json' },
      })
    ).default as {
      [entryPointPath]: { file: string; css: string[] };
    }
  )[entryPointPath];

  if (process.env.NODE_ENV === 'production') {
    return {
      scripts: script(`${host}/${resources.file}`),
      styles: [
        ...resources.css.map(
          (href: string) =>
            `<link type="text/css" rel="stylesheet" href="${host}/${href}"></link>`,
        ),
      ].join(''),
    };
  }

  return {
    styles: '',
    scripts: [
      'http://localhost:5173/@vite/client',
      `http://localhost:5173/${entryPointPath}`,
    ]
      .map(script)
      .join(''),
  };
};
