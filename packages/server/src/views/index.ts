import html, { Template, unsafeHtml } from "decorator-shared/html";
import { Language } from "decorator-shared/params";
import { env } from "../env/server";
import type { Manifest as ViteManifest } from "vite";
import { buildHtmlElementString } from "../lib/html-element-string-builder";
import { HtmlTagProps } from "decorator-shared/types";

const ENTRY_POINT_PATH = "src/main.ts";

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

const cdnUrl = (src: string) => `${env.CDN_URL}/${src}`;

const getCSSUrl = async () => {
    const manifest = (await import("decorator-client/dist/.vite/manifest.json"))
        .default;

    return cdnUrl(manifest["src/main.ts"].css[0]);
};

const getCSRScriptUrl = async () => {
    const csrManifest = (
        await import("decorator-client/dist/.vite/csr.manifest.json")
    ).default;

    return cdnUrl(csrManifest["src/csr.ts"].file);
};

const getCssAsString = async () => {
    if (env.NODE_ENV === "development" && !env.HAS_EXTERNAL_DEV_CONSUMER) {
        return "";
    }

    return buildHtmlElementString({
        tag: "link",
        attribs: {
            type: "text/css",
            rel: "stylesheet",
            href: await getCSSUrl(),
        },
    });
};

const getScriptsProps = async (): Promise<HtmlTagProps[]> => {
    if (env.NODE_ENV === "development") {
        return [
            {
                tag: "script",
                attribs: {
                    src: "http://localhost:5173/@vite/client",
                    type: "module",
                },
            },
            {
                tag: "script",
                attribs: {
                    src: `http://localhost:5173/${ENTRY_POINT_PATH}`,
                    type: "module",
                },
            },
        ];
    }

    const manifest = (await import("decorator-client/dist/.vite/manifest.json"))
        .default as ViteManifest;

    const appScripts: HtmlTagProps[] = Object.values(manifest).map((item) => ({
        tag: "script",
        attribs: {
            src: cdnUrl(item.file),
            type: "module",
            // Load everything except the entry file async
            ...(!item.isEntry && { async: "true", fetchpriority: "low" }),
        },
    }));

    return [
        ...appScripts,
        {
            tag: "script",
            attribs: {
                src: "https://in2.taskanalytics.com/tm.js",
                type: "module",
                async: "true",
                fetchpriority: "low",
            },
        },
        {
            tag: "script",
            body: hotjarScript,
            attribs: {
                type: "module",
                async: "true",
                fetchpriority: "low",
            },
        },
    ];
};

const scriptsProps = await getScriptsProps();

const cssAsString = await getCssAsString();
const scriptsAsString = scriptsProps.map(buildHtmlElementString).join("");

export const csrAssets = {
    cssUrl: await getCSSUrl(),
    csrScriptUrl: await getCSRScriptUrl(),
    mainScriptsProps: scriptsProps,
};

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
                <div id="styles" style="display:none">
                    ${unsafeHtml(cssAsString)}
                </div>
                <div id="header-withmenu">${header}</div>
                <main id="maincontent">${main}</main>
                <div id="footer-withmenu">${footer}</div>
                <div id="scripts" style="display:none">
                    <script>
                        window.__DECORATOR_DATA__ = JSON.parse(
                            document.getElementById("__DECORATOR_DATA__")
                                ?.innerHTML ?? "",
                        );
                    </script>
                    ${unsafeHtml(scriptsAsString)}${decoratorData}
                </div>
            </body>
        </html>
    `;
}
