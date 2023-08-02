import http from 'http';
import express from 'express';
import { WebSocketServer } from 'ws';
import { parseParams } from './params';
import cors from 'cors';
import { DataKeys, getData } from './utils';
import { Index } from './views/index';
import { Footer } from './views/footer';
import { HeaderMenuLinks } from './views/header-menu-links';
import { Header } from './views/header';
import { decoratorParams } from './middlewares';

const isProd = process.env.NODE_ENV === 'production';
const port = 3000;
const host = process.env.HOST ?? `http://localhost:${port}`;

const app = express();

app.use(cors());
app.use(express.static(isProd ? 'dist' : 'public'));
app.use(decoratorParams);

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
    })
  );
});

app.use('/header', async (req, res) => {
  const params = req.decorator;
  const data = await getData(params);
  return res.status(200).send(
    HeaderMenuLinks({
      headerMenuLinks: data.headerMenuLinks,
    })
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
  const entryPointPath = 'client/main.ts';

  const scripts = () => {
    const script = (src: string) =>
      `<script type="module" src="${src}"></script>`;

    if (isProd) {
      const resources: { file: string; css: string[] } =
        require('./dist/manifest.json')[entryPointPath];
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
  const links = () => {
    const entryPointPath = 'client/main.ts';

    if (isProd) {
      const resources: { file: string; css: string[] } =
        require('./dist/manifest.json')[entryPointPath];
      return [
        ...resources.css.map(
          (href: string) =>
            `<link type="text/css" rel="stylesheet" href="${host}/${href}"></link>`
        ),
      ].join('');
    } else {
      return '';
    }
  };

  const data = await getData(req.decorator);

  res.status(200).send(
    Index({
      scripts: scripts(),
      links: links(),
      language: req.decorator.language,
      header: Header({
        texts: data.texts,
        mainMenu: data.mainMenu,
        headerMenuLinks: data.headerMenuLinks,
        innlogget: false,
        isNorwegian: true,
        breadcrumbs: req.decorator.breadcrumbs,
        utilsBackground: req.decorator.utilsBackground,
        openSearch: (el) => {
          el.classList.toggle('active');
          document.getElementById('sok-dropdown')?.classList.toggle('active');
        },
      }),
      footer: Footer({
        texts: data.texts,
        personvern: data.personvern,
        footerLinks: data.footerLinks,
        simple: req.decorator.simple,
        feedback: req.decorator.feedback,
      }),
    })
  );
});

const server = http.createServer(app);

if (!isProd) {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) =>
    wss.handleUpgrade(request, socket, head, (ws) =>
      ws.emit('connection', ws, request)
    )
  );
}

server.listen(port, function () {
  console.log(`Listening on http://localhost:${port}`);
});
