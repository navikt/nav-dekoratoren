import { Router } from '@stricjs/router';
import { stream, CORS } from '@stricjs/utils';

import { DataKeys, getData } from './utils';
import { Index } from './views/index';
import { Footer } from './views/footer';
import { HeaderMenuLinks } from './views/header-menu-links';
import { Header } from './views/header';
import { Params, parseParams } from './params';

const isProd = process.env.NODE_ENV === 'production';
const port = 3000;
const host = process.env.HOST ?? `http://localhost:${port}`;

const router = new Router();
const cors = new CORS();

router.get(isProd ? '/dist/*' : '/public/*', stream('.'));

router.get('/dekoratoren/api/sok', async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const ord = searchParams.get('ord');
  if (!ord) {
    return new Response('Missing query parameter "ord"', {
      status: 400,
      headers: {
        ...cors.headers,
      },
    });
  }

  return await fetch(`https://www.nav.no/dekoratoren/api/sok?ord=${ord}`);
});

router.get('/footer', async (req) => {
  const params = parseDecoratorParams(req);
  const data = await getData(params);

  return new Response(
    Footer({
      simple: params.simple,
      personvern: data.personvern,
      footerLinks: data.footerLinks,
      feedback: params.feedback,
      texts: data.texts,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'text/html;charset=utf-8', ...cors.headers },
    },
  );
});

router.get('/header', async (req) => {
  const params = parseDecoratorParams(req);
  const data = await getData(params);

  return new Response(
    HeaderMenuLinks({
      headerMenuLinks: data.headerMenuLinks,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'text/html;charset=utf-8', ...cors.headers },
    },
  );
});

router.get('/data/:key', async (req) => {
  const dataKey = req.params.key as DataKeys;

  if (!dataKey) {
    return new Response('Missing key', { status: 400 });
  }

  const decoratorParams = parseDecoratorParams(req);
  const data = await getData(decoratorParams);

  const subset = data[dataKey];

  if (!subset) {
    return new Response('Data not found with key:' + dataKey, {
      status: 400,
      headers: { ...cors.headers },
    });
  }

  return Response.json(subset, { status: 200 });
});

router.get('/', async (req) => {
  const entryPointPath = 'client/main.ts';

  const getResources = async () =>
    (
      (await import('./dist/manifest.json', { assert: { type: 'json' } }))
        .default as {
        [entryPointPath]: { file: string; css: string[] };
      }
    )[entryPointPath];

  const scripts = async () => {
    const script = (src: string) =>
      `<script type="module" src="${src}"></script>`;

    if (isProd) {
      const resources = await getResources();
      return script(`${host}/${resources.file}`);
    } else {
      return [
        'http://localhost:5173/@vite/client',
        `http://localhost:5173/${entryPointPath}`,
      ]
        .map(script)
        .join('');
    }
  };
  const links = async () => {
    if (isProd) {
      const resources = await getResources();
      return [
        ...resources.css.map(
          (href: string) =>
            `<link type="text/css" rel="stylesheet" href="${host}/${href}"></link>`,
        ),
      ].join('');
    } else {
      return '';
    }
  };

  const params = parseDecoratorParams(req);
  const data = await getData(params);

  return new Response(
    Index({
      scripts: await scripts(),
      links: await links(),
      language: params.language,
      header: Header({
        texts: data.texts,
        mainMenu: data.mainMenu,
        headerMenuLinks: data.headerMenuLinks,
        innlogget: false,
        isNorwegian: true,
        breadcrumbs: params.breadcrumbs,
        utilsBackground: params.utilsBackground,
        availableLanguages: params.availableLanguages,
      }),
      footer: Footer({
        texts: data.texts,
        personvern: data.personvern,
        footerLinks: data.footerLinks,
        simple: params.simple,
        feedback: params.feedback,
      }),
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'text/html;charset=utf-8', ...cors.headers },
    },
  );
});

router.use(
  404,
  (req) =>
    new Response(`Unable to find: ${req.url}`, {
      status: 404,
      headers: { ...cors.headers },
    }),
);

export function parseDecoratorParams(req: Request): Params {
  const result = parseParams(req.query);

  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error.message);
  }
}

export default router;
