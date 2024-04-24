import html, { Template, unsafeHtml } from 'decorator-shared/html';
import { Language } from 'decorator-shared/params';
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
    const mainManifest = (await import('decorator-client/dist/.vite/manifest.json')).default;
    const csrManifest = (await import('decorator-client/dist/.vite/csr.manifest.json')).default;
    const thirdPartyManifest = (await import('decorator-client/dist/.vite/analytics.manifest.json')).default;

    return {
        ...mainManifest,
        ...csrManifest,
        ...thirdPartyManifest,
    };
};

type AssetFormatter = (src: string) => string;

const script: AssetFormatter = (src) => `<script type="module" src="${src}"></script>`;

const asyncScript: AssetFormatter = (src) => `<script fetchpriotiy='low' async type="module" src="${src}"></script>`;

const asyncScriptInline: AssetFormatter = (src) => `<script fetchpriotiy='low' async type="module">${src}</script>`;

const partytownInlineScript: AssetFormatter = (code) => `<script type="text/partytown">${code}</script>`;

const cssLink: AssetFormatter = (src) => `<link type="text/css" rel="stylesheet" href="${src}" />`;

export const cdnUrl: AssetFormatter = (src) => `${env.CDN_URL}/${src}`;

type EnvAssets = Record<NodeEnv, string>;

export const getEnvAssets = async () => {
    const manifest = await getManifest();

    const css: EnvAssets = {
        production: manifest[entryPointPath].css.map(cdnUrl).map(cssLink).join(''),
        development: cssLink(''), // Dummy to ensure the styles-container is not empty
    };

    const scripts: EnvAssets = {
        production: [
            script(cdnUrl(manifest[entryPointPath].file)),
            asyncScript(cdnUrl(manifest[entryPointPathAnalytics].file)),
            asyncScript(vendorScripts.taskAnalytics),
            [inlineVendorScripts.hotjar].map(asyncScriptInline).join(''),
        ].join(''),
        development: [
            ['http://localhost:5173/@vite/client', `http://localhost:5173/${entryPointPath}`, `http://localhost:5173/${entryPointPathAnalytics}`]
                .map(script)
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

export function Index({
    language,
    header,
    footer,
    decoratorData,
    maskDocument = false,
    main,
}: {
    language: Language;
    header: Template;
    footer: Template;
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
            </head>
            <body>
                <div id="styles" style="display:none">${unsafeHtml(links)}</div>
                <div id="header-withmenu">${header}</div>
                <main style="height:2000px;">
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
                        { title: 'Ditt NAV', url: 'https://www.nav.no/person/dittnav' }, // Sender brukeren til definert url
    {
        title: 'Kontakt oss',
        url: 'https://www.nav.no/person/kontakt-oss/nb/',
        handleInApp: true, // Håndteres av onBreadcrumbClick
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
                </main>
                <div id="footer-withmenu">${footer}</div>
                <div id="scripts" style="display:none">
                    ${unsafeHtml(scripts)}${decoratorData}
                    <script>
                        window.__DECORATOR_DATA__ = JSON.parse(document.getElementById('__DECORATOR_DATA__')?.innerHTML ?? '');
                    </script>
                </div>
            </body>
        </html>
    `;
}
