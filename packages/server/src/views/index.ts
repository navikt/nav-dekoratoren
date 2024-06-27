import html, { Template, unsafeHtml } from "decorator-shared/html";
import { Language } from "decorator-shared/params";
import { env } from "../env/server";
import type { Manifest as ViteManifest } from "vite";
import { buildHtmlElementString } from "../lib/html-element-string-builder";

const entryPointPath = "src/main.ts";

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

const cssLink = (src: string) =>
    `<link type="text/css" rel="stylesheet" href="${src}" />`;

const cdnUrl = (src: string) => `${env.CDN_URL}/${src}`;

const getCss = async () => {
    if (env.NODE_ENV === "development" && !env.HAS_EXTERNAL_DEV_CONSUMER) {
        return [];
    }

    const manifest = (await import("decorator-client/dist/.vite/manifest.json"))
        .default;
    return manifest[entryPointPath].css.map(cdnUrl).map(cssLink);
};

type ScriptProps = {
    type: string;
    async?: boolean;
} & ({ src: string; body?: never } | { src?: never; body: string });

export const getScriptProps = async (): Promise<ScriptProps[]> => {
    if (env.NODE_ENV === "development") {
        return [
            { src: "http://localhost:5173/@vite/client", type: "module" },
            { src: `http://localhost:5173/${entryPointPath}`, type: "module" },
            { body: hotjarScript, type: "text/partytown" },
        ];
    }

    const manifest = (await import("decorator-client/dist/.vite/manifest.json"))
        .default as ViteManifest;

    const appScripts: ScriptProps[] = Object.values(manifest).map((item) => ({
        src: cdnUrl(item.file),
        async: !item.isEntry,
        type: "module",
    }));

    return [
        ...appScripts,
        {
            src: "https://in2.taskanalytics.com/tm.js",
            async: true,
            type: "module",
        },
        { body: hotjarScript, type: "module" },
    ];
};

const getScripts = async () => {
    const scriptProps = await getScriptProps();

    return scriptProps.map(({ src, body, type, async }) =>
        buildHtmlElementString({
            tag: "script",
            body,
            attribs: {
                type,
                ...(async && { async: "true", fetchpriority: "low" }),
                ...(src && { src }),
            },
        }),
    );
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
                <main id="maincontent">${main}</main>
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
