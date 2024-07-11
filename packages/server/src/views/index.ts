import html, { unsafeHtml } from "decorator-shared/html";
import { Params } from "decorator-shared/params";
import { env } from "../env/server";
import { buildHtmlElementString } from "../lib/html-element-string-builder";
import { ScriptsTemplate, scriptsProps } from "./scripts";
import { getFeatures } from "../unleash";
import { HeaderTemplate } from "./header/header";
import { FooterTemplate } from "./footer/footer";
import { getSplashPage } from "./splash-page";

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

const cssAsString = await getCssAsString();

export const csrAssets = {
    cssUrl: await getCSSUrl(),
    csrScriptUrl: await getCSRScriptUrl(),
    mainScriptsProps: scriptsProps,
};

type IndexProps = {
    params: Params;
    url: string;
};

export const IndexTemplate = async ({ params, url }: IndexProps) => {
    const { language } = params;
    const features = getFeatures();

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
                <div id="header-withmenu">
                    ${HeaderTemplate({
                        params,
                        withContainers: true,
                    })}
                </div>
                <main id="maincontent">${getSplashPage(url)}</main>
                <div id="footer-withmenu">
                    ${await FooterTemplate({
                        params,
                        features,
                        withContainers: true,
                    })}
                </div>
                <div id="scripts" style="display:none">
                    ${ScriptsTemplate({
                        params,
                        features,
                    })}
                </div>
                <!-- The elements below are needed for backwards compatibility with certain older implementations -->
                <div id="skiplinks"></div>
                <div id="megamenu-resources"></div>
                <div id="webstats-ga-notrack"></div>
            </body>
        </html>
    `;
};
