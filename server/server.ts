import express, { Request } from 'express';
import cors from 'cors';
import { DataKeys, getData } from '@/utils';
import { Index } from '@/views/index';
import { Footer } from '@/views/footer';
import { HeaderMenuLinks } from '@/views/header-menu-links';
import { Header } from '@/views/header';
import { decoratorParams } from '@/server/middlewares';
import { mockAuthHandler } from '@/server/mock/authMock';
import {
  mockSessionHandler,
  refreshMockSessionHandler,
} from '@/server/mock/sessionMock';
import { DecoratorEnv } from '@/views/decorator-env';
import { DecoratorLens } from '@/decorator-lens';
import { isAliveHandler, isReadyHandler } from './common';

import { driftsmeldingerHandler } from './api/driftsmeldinger';

const isProd = process.env.NODE_ENV === 'production';
const isLocal = process.env.NODE_ENV === 'local';
const port = isLocal ? 8089 : 3000;
const host = process.env.HOST ?? `http://localhost:${port}`;

const entryPointPath = 'client/main.ts';

const script = (src: string) => `<script type="module" src="${src}"></script>`;

const getResources = async () => {
  const resources = (
    (await import('../dist/manifest.json', { assert: { type: 'json' } }))
      .default as {
      [entryPointPath]: { file: string; css: string[] };
    }
  )[entryPointPath];

  if (isProd) {
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

const resources = await getResources();
const app = express();

app.use(cors());
app.use(express.static(isProd ? 'dist' : 'public'));
app.use(decoratorParams);

app.use('/api/isReady', isReadyHandler);
app.use('/api/isAlive', isAliveHandler);
app.use('/api/auth', mockAuthHandler);
app.get('/api/oauth2/session', mockSessionHandler);
app.get('/api/oauth2/session/refresh', refreshMockSessionHandler);

type SearchHit = {
  displayName: string;
  highlight: string;
  href: string;
};

type SearchResponse = {
  c: number;
  isMore: boolean;
  s: number;
  word: string;
  total: number;
  hits: SearchHit[];
};

app.use('/dekoratoren/api/sok', async (req: Request<{ ord: string }>, res) => {
  const results = (await (
    await fetch(`https://www.nav.no/dekoratoren/api/sok?ord=${req.query.ord}`)
  ).json()) as SearchResponse;

  res.json({
    hits: results.hits.slice(0, 5),
    total: results.total,
  });
});

app.use('/dekoratoren/api/driftsmeldinger', driftsmeldingerHandler);

app.use('/footer', async (req, res) => {
  const params = req.decorator;
  // Maybe make into middleware
  const data = await getData(params);

  return res.status(200).send(
    Footer({
      simple: req.decorator.simple,
      personvern: data.personvern,
      footerLinks: data.footerLinks,
      feedback: req.decorator.feedback,
      texts: data.texts,
    }),
  );
});

app.use('/inspect-data', async (req, res) => {
  const data = await getData(req.decorator);
  const raw = await fetch('https://www.nav.no/dekoratoren/api/meny');
  res.json({
    data,
    raw: await raw.json(),
  });
});

app.use('/header', async (req, res) => {
  const params = req.decorator;
  const data = await getData(params);
  return res.status(200).send(
    HeaderMenuLinks({
      headerMenuLinks: data.headerMenuLinks,
    }),
  );
});

app.get('/data/:key', async (req, res) => {
  const { params } = req;
  const dataKey = params.key as DataKeys;

  if (!dataKey) {
    return res.status(400).send('Missing key');
  }

  const data = await getData(req.decorator);
  const subset = data[dataKey];

  if (!subset) {
    res.status(404).send('Data not found with key:' + dataKey);
  }

  res.send(subset);
});

app.use('/', async (req, res) => {
  const data = await getData(req.decorator);
  const fullUrl = req.protocol + '://' + req.get('host');

  res.status(200).send(
    Index({
      scripts: resources.scripts,
      links: resources.styles,
      language: req.decorator.language,
      header: Header({
        texts: data.texts,
        mainMenu: data.mainMenu,
        headerMenuLinks: data.headerMenuLinks,
        innlogget: false,
        isNorwegian: true,
        breadcrumbs: req.decorator.breadcrumbs,
        utilsBackground: req.decorator.utilsBackground,
        availableLanguages: req.decorator.availableLanguages,
        myPageMenu: data.myPageMenu,
      }),
      footer: Footer({
        texts: data.texts,
        personvern: data.personvern,
        footerLinks: data.footerLinks,
        simple: req.decorator.simple,
        feedback: req.decorator.feedback,
      }),
      env: DecoratorEnv({
        origin: fullUrl,
        env: req.decorator,
      }),
      lens: DecoratorLens({
        origin: fullUrl,
        env: req.decorator,
        query: req.query,
      }),
    }),
  );
});

app.listen(port, function () {
  console.log(`Listening on http://localhost:${port}`);
});
