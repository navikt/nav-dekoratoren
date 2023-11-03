import html, { Template, unsafeHtml } from 'decorator-shared/html';
import { Language } from 'decorator-shared/params';
import { Partytown } from './partytown';
import { Button } from 'decorator-shared/views/components/button';

const entryPointPath = 'src/main.ts';
const entryPointPathAnalytics = 'src/analytics/analytics.ts';

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

const getManifest = async () =>
  (await import('decorator-client/dist/manifest.json')).default;

type AssetFormatter = (src: string) => string;

const script: AssetFormatter = (src) =>
  `<script type="module" src="${src}"></script>`;
const partytownScript: AssetFormatter = (src) =>
  `<script type="text/partytown" src="${src}"></script>"`;
const partytownInlineScript: AssetFormatter = (code) =>
  `<script type="text/partytown">${code}</script>"`;
const hostUrl: AssetFormatter = (src) => `${process.env.HOST ?? ``}${src}`;

type EnvAssets = Record<'production' | 'dev', string>;

const getEnvAssets = async () => {
  const manifest = await getManifest();
  const env = process.env.NODE_ENV === 'production' ? 'production' : 'dev';

  const css: EnvAssets = {
    production: manifest[entryPointPath].css
      .map(
        (href: string) =>
          `<link type="text/css" rel="stylesheet" href="${
            process.env.HOST ?? ``
          }/public/${href}"></link>`,
      )
      .join(''),
    dev: '',
  };

  const scripts: EnvAssets = {
    production: [
      script(hostUrl(`/public/${manifest[entryPointPath].file}`)),
      partytownScript(
        hostUrl(`/public/${manifest[entryPointPathAnalytics].file}`),
      ),
      partytownScript(vendorScripts.taskAnalytics),
      [inlineVendorScripts.hotjar].map(partytownInlineScript).join(''),
    ].join(''),
    dev: [
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
    links: css[env],
    scripts: scripts[env],
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
        <title>NAV Dekoratør</title>
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
                      {
                        title: 'Arbeid og opphold i Norge',
                        url: '/no/person/flere-tema/arbeid-og-opphold-i-norge',
                      },
                      {
                        title: 'Medlemskap i folketrygden',
                      },
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
                      {
                        locale: 'nb',
                        url: 'https://www.nav.no/person/kontakt-oss',
                      },
                      {
                        locale: 'en',
                        url: 'https://www.nav.no/person/kontakt-oss/en/',
                      },
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
                    utilsBackground: 'white',
                  },
                })
              })()"
          >
            Set utils background
          </button>
          <div>${main}</div>
        </main>
        <div id="footer-withmenu" class="bg-white">
          ${shareScreen} ${logoutWarning} ${feedback} ${footer}
        </div>
        ${lens}
        <div id="scripts" style="display:none">
          ${unsafeHtml(scripts)}${decoratorData}
        </div>
      </body>
    </html>
  `;
}
