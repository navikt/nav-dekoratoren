import html, { Template, unsafeHtml } from "decorator-shared/html";
import { Language } from "decorator-shared/params";
import { env } from "../env/server";

const entryPointPath = "src/main.ts";
const entryPointPathAnalytics = "src/analytics/analytics.ts";

// https://github.com/BuilderIO/partytown/issues/241
// See how this works in production
const hotjarScript = `(function(h,o,t,j,a,r){
h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
h._hjSettings={hjid:118350,hjsv:6};
a=o.getElementsByTagName('head')[0];
r=o.createElement('script');r.async=1;
r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=')`;

export const getMainScriptUrl = async () => {
    const manifest = (await import("decorator-client/dist/.vite/manifest.json"))
        .default;

    return cdnUrl(manifest[entryPointPath].file);
};

export const getCSRScriptUrl = async () => {
    const csrManifest = (
        await import("decorator-client/dist/.vite/csr.manifest.json")
    ).default;

    return cdnUrl(csrManifest["src/csr.ts"].file);
};

export const getClientCSSUrl = async () => {
    const manifest = (await import("decorator-client/dist/.vite/manifest.json"))
        .default;

    return cdnUrl(manifest["src/main.ts"].css[0]);
};

type AssetFormatter = (src: string) => string;

const script: AssetFormatter = (src) =>
    `<script type="module" src="${src}"></script>`;

const asyncScript: AssetFormatter = (src) =>
    `<script fetchpriority="low" async type="module" src="${src}"></script>`;

const asyncScriptInline: AssetFormatter = (src) =>
    `<script fetchpriority="low" async type="module">${src}</script>`;

const partytownInlineScript: AssetFormatter = (code) =>
    `<script type="text/partytown">${code}</script>`;

const cssLink: AssetFormatter = (src) =>
    `<link type="text/css" rel="stylesheet" href="${src}" />`;

const cdnUrl: AssetFormatter = (src) => `${env.CDN_URL}/${src}`;

const getCss = async () => {
    if (env.NODE_ENV === "development" && !env.HAS_EXTERNAL_DEV_CONSUMER) {
        return [];
    }

    const manifest = (await import("decorator-client/dist/.vite/manifest.json"))
        .default;
    return manifest[entryPointPath].css.map(cdnUrl).map(cssLink);
};

export const getScripts = async () => {
    if (env.NODE_ENV === "production") {
        const manifest = (
            await import("decorator-client/dist/.vite/manifest.json")
        ).default;
        // const thirdPartyManifest = (
        //     await import("decorator-client/dist/.vite/analytics.manifest.json")
        // ).default;

        const scripts = Object.values(manifest).map((entry) =>
            script(cdnUrl(entry.file)),
        );

        return [
            ...scripts,
            // asyncScript(
            //     cdnUrl(thirdPartyManifest[entryPointPathAnalytics].file),
            // ),
            asyncScript("https://in2.taskanalytics.com/tm.js"),
            asyncScriptInline(hotjarScript),
        ];
    }

    return [
        ...[
            "http://localhost:5173/@vite/client",
            `http://localhost:5173/${entryPointPath}`,
            // `http://localhost:5173/${entryPointPathAnalytics}`,
        ].map(script),
        partytownInlineScript(hotjarScript),
    ];
};

const css = (await getCss()).join("");
const scripts = (await getScripts()).join("");

type Props = {
    language: Language;
    header: Template;
    footer: Template;
    decoratorData: Template;
    main?: Template;
};

export function Index({
    language,
    header,
    footer,
    decoratorData,
    main,
}: Props) {
    return html`
        <!doctype html>
        <html lang="${language}">
            <head>
                <title>${"NAV Dekoratør"}</title>
                <link
                    rel="preload"
                    href="https://cdn.nav.no/aksel/fonts/SourceSans3-normal.woff2"
                    as="font"
                    type="font/woff2"
                    crossorigin="anonymous"
                />
                <meta charset="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </head>
            <body>
                <div id="styles" style="display:none">${unsafeHtml(css)}</div>
                <div id="header-withmenu">${header}</div>
                <main>${main}</main>
                <div id="footer-withmenu">${footer}</div>
                <div id="scripts" style="display:none">
                    ${unsafeHtml(scripts)}${decoratorData}
                    <script>
                        window.__DECORATOR_DATA__ = JSON.parse(
                            document.getElementById("__DECORATOR_DATA__")
                                ?.innerHTML ?? "",
                        );
                    </script>
                </div>
            </body>
        </html>
    `;
}
