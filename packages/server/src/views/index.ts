import html from 'decorator-shared/html';
import { WebcomponentTemplates } from './web-component-templates';
import clientManifest from 'decorator-client/dist/manifest.json';
import { Language } from 'decorator-shared/params';
import { Partytown } from './partytown';

const entryPointPath = 'src/main.ts';
const entryPointPathAnalytics = 'src/analytics/analytics.ts';

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

// This can be calcualted once at startup
const Scripts = () => {
  const script = (src: string) =>
    `<script type="module" src="${src}"></script>`;

  const partytownScript = (src: string) =>
    `<script type="text/partytown" src="${src}"></script>"`;

  return process.env.NODE_ENV === 'production'
    ? [
        script(
          `${process.env.HOST ?? ``}/public/${
            clientManifest[entryPointPath].file
          }`,
        ),
        partytownScript(
          `${process.env.HOST ?? ``}/public/${
            clientManifest[entryPointPathAnalytics].file
          }`,
        ),
      ].join('')
    : [
        'http://localhost:5173/@vite/client',
        `http://localhost:5173/${entryPointPath}`,
        `http://localhost:5173/${entryPointPathAnalytics}`,
      ]
        .map(script)
        .join('');
};

export function Index({
  language,
  header,
  feedback,
  logoutWarning,
  footer,
  env,
  lens,
  decoratorData,
}: {
  language: Language;
  header: string;
  feedback: string;
  footer: string;
  logoutWarning: string;
  env: string;
  lens: string;
  decoratorData: string;
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
        ${Partytown()}
      </head>
      <body>
        <div id="styles" style="display:none">${Links()}</div>
        ${WebcomponentTemplates()} ${header}
        <main>
          <button class="button button-main" id="amplitude-test">
            Test amplitude!
          </button>
        </main>
        <div id="footer-withmenu" class="bg-white">
          ${logoutWarning} ${feedback} ${footer}
        </div>
        ${env} ${lens}
        <div id="scripts" style="display:none">
          ${Scripts()}${decoratorData}
        </div>
      </body>
    </html>
  `;
}
