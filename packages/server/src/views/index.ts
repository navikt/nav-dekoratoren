import html from 'decorator-shared/html';
import { WebcomponentTemplates } from './web-component-templates';
import clientManifest from 'decorator-client/dist/manifest.json';
import { Language } from 'decorator-shared/params';

const entryPointPath = 'src/main.ts';

const Links = () =>
  process.env.NODE_ENV === 'production'
    ? [
        ...clientManifest[entryPointPath].css.map(
          (href: string) =>
            `<link type="text/css" rel="stylesheet" href="${
              process.env.HOST ?? ``
            }/public/${href}"></link>`,
        ),
      ].join('')
    : '';

const Scripts = () => {
  const script = (src: string) =>
    `<script type="module" src="${src}"></script>`;

  return process.env.NODE_ENV === 'production'
    ? script(
        `${process.env.HOST ?? ``}/public/${
          clientManifest[entryPointPath].file
        }`,
      )
    : [
        'http://localhost:5173/@vite/client',
        `http://localhost:5173/${entryPointPath}`,
      ]
        .map(script)
        .join('');
};

export function Index({
  language,
  header,
  footer,
  env,
  lens,
}: {
  language: Language;
  header: string;
  footer: string;
  env: string;
  lens: string;
}) {
  return html`
    <!doctype html>
    <html lang="${language}">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div id="styles" style="display:none">${Links()}</div>
        ${WebcomponentTemplates()} ${header}
        <main>main</main>
        ${footer} ${env} ${lens}
        <div id="scripts" style="display:none">${Scripts()}</div>
      </body>
    </html>
  `;
}
