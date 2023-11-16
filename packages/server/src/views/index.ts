import html, { Template, unsafeHtml } from 'decorator-shared/html';
import { Language } from 'decorator-shared/params';
import { Partytown } from './partytown';
import { Button } from 'decorator-shared/views/components/button';
import { env } from '../env/server';
import { NodeEnv } from '../env/schema';

export const entryPointPath = 'src/main.ts';
export const entryPointPathAnalytics = 'src/analytics/analytics.ts';

const vendorScripts = {
  taskAnalytics: 'https://in2.taskanalytics.com/tm.js',
} as const;

// https://github.com/BuilderIO/partytown/issues/241
// See how this works in production
const inlineVendorScripts = {
  hotjar: `(function(h,o,t,j,a,r){
h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
h._hjSettings={hjid:118350,hjsv:6};
a=o.getElementsByTagName('head')[0];
r=o.createElement('script');r.async=1;
r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=')`,
} as const;

/* Merge the two manifests*/
export const getManifest = async () => {
  const dir = 'decorator-client/dist/.vite'
  const mainManifest = (await import(`${dir}/manifest.json`))
    .default;
  const thirdPartyManifest = (
    await import(`${dir}/analytics.manifest.json`)
  ).default;

  return Object.assign({}, mainManifest, thirdPartyManifest);
};

type AssetFormatter = (src: string) => string;

const script: AssetFormatter = (src) =>
  `<script type="module" src="${src}"></script>`;
const partytownScript: AssetFormatter = (src) =>
  `<script type="text/partytown" src="${src}"></script>"`;
const partytownInlineScript: AssetFormatter = (code) =>
  `<script type="text/partytown">${code}</script>"`;
const cssLink: AssetFormatter = (src) =>
  `<link type="text/css" rel="stylesheet" href="${src}"></link>`;

const hostUrl: AssetFormatter = (src) => `${env.HOST ?? ``}${src}`;
const cdnUrl: AssetFormatter = (src) => `${env.CDN_URL}/${src}`;

type EnvAssets = Record<NodeEnv, string>;

console.log('Host is', env.HOST);

const getEnvAssets = async () => {
  const manifest = await getManifest();

  const css: EnvAssets = {
    production: manifest[entryPointPath].css.map(cdnUrl).map(cssLink).join(''),
    development: '',
  };

  const scripts: EnvAssets = {
    production: [
      script(cdnUrl(manifest[entryPointPath].file)),
      partytownScript(
        hostUrl(`/public/${manifest[entryPointPathAnalytics].file}`),
      ),
      partytownScript(vendorScripts.taskAnalytics),
      [inlineVendorScripts.hotjar].map(partytownInlineScript).join(''),
    ].join(''),
    development: [
      [
        'http://localhost:5173/@vite/client',
        `http://localhost:5173/${entryPointPath}`,
      ]
        .map(script)
        .join(''),
      [
        vendorScripts.taskAnalytics,
        hostUrl(`/public/${manifest[entryPointPathAnalytics].file}`),
      ]
        .map(partytownScript)
        .join(''),
      [inlineVendorScripts.hotjar].map(partytownInlineScript).join(''),
    ].join(''),
  };

  return {
    links: css[env.NODE_ENV],
    scripts: scripts[env.NODE_ENV],
  };
};

const assets = await getEnvAssets();

export async function Index({
  language,
  header,
  feedback,
  logoutWarning,
  footer,
  lens,
  decoratorData,
  maskDocument = false,
  main,
  shareScreen,
}: {
  language: Language;
  header: Template;
  feedback?: Template;
  footer: Template;
  logoutWarning?: Template;
  shareScreen?: Template;
  lens: Template;
  decoratorData: Template;
  maskDocument?: boolean;
  main?: Template;
}) {
  const { links, scripts } = assets;

  return html`
    <!doctype html>
    <html lang="${language}" ${maskDocument ? 'data-hj-supress' : ''}>
      <head>
        <title>${'NAV Dekoratør'}</title>
        <link
          rel="preload"
          href="https://cdn.nav.no/aksel/fonts/SourceSans3-normal.woff2"
          as="font"
          type="font/woff2"
          crossorigin="anonymous"
        />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        ${Partytown()}
      </head>
      <body>
        <div id="styles" style="display:none">${unsafeHtml(links)}</div>
        <div id="header-withmenu">${header}</div>
        <main>
          ${Button({
            text: 'Test amplitude!',
            variant: 'primary',
            id: 'amplitude-test',
          })}
          <button
            onclick="(() => {
                window.postMessage({
                  source: 'decoratorClient',
                  event: 'params',
                  payload: {
                    breadcrumbs: [
                    ],
                  },
                })
              })()"
          >
            Set breadcrumbs
          </button>
          <button
            onclick="(() => {
              window.postMessage({
                  source: 'decoratorClient',
                  event: 'params',
                  payload: {
                    availableLanguages: [
                    ],
                  },
                })
              })()"
          >
            Set available languages
          </button>
          <button
            onclick="(() => {
              window.postMessage({
                  source: 'decoratorClient',
                  event: 'params',
                  payload: {
                    utilsBackground: 'gray',
                  },
                })
              })()"
          >
            Markup was updated
          </button>
          <div>${main}</div>
          <script>
            window.addEventListener('message', (e) => {
              if (e.data.source === 'decorator') {
                if (e.data.event === 'languageSelect') {
                  window.postMessage({
                    source: 'decoratorClient',
                    event: 'params',
                    payload: {
                      language: e.data.payload.locale,
                    },
                  });
                }
              }
            });
          </script>
        </main>
        <div id="footer-withmenu">
          ${shareScreen} ${logoutWarning} ${feedback} ${footer}
        </div>
        ${lens}
        <div id="scripts" style="display:none">
          ${unsafeHtml(scripts)}${decoratorData}
          <script>
            window.__DECORATOR_DATA__ = JSON.parse(
              document.getElementById('__DECORATOR_DATA__')?.innerHTML ?? '',
            );
          </script>
        </div>
      </body>
    </html>
  `;
}
