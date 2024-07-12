import { buildHtmlElementString } from "../lib/html-element-string-builder";
import { unsafeHtml } from "decorator-shared/html";
import { HtmlElementProps } from "decorator-shared/types";

import faviconIco from "./head-assets/favicon.ico";
import faviconSvg from "./head-assets/favicon.svg";
import appleTouchIcon from "./head-assets/apple-touch-icon.png";
import webManifest from "./head-assets/site.webmanifest";

export const headAssets: HtmlElementProps[] = [
    {
        tag: "link",
        attribs: {
            rel: "preload",
            href: "https://cdn.nav.no/aksel/fonts/SourceSans3-normal.woff2",
            as: "font",
            type: "font/woff2",
            crossorigin: "anonymous",
        },
    },
    {
        tag: "link",
        attribs: {
            rel: "icon",
            href: buildCdnUrl(faviconIco),
            sizes: "any",
        },
    },
    {
        tag: "link",
        attribs: {
            rel: "icon",
            href: buildCdnUrl(faviconSvg),
            type: "image/svg+xml",
        },
    },
    {
        tag: "link",
        attribs: {
            rel: "apple-touch-icon",
            href: buildCdnUrl(appleTouchIcon),
        },
    },
    {
        tag: "link",
        attribs: {
            rel: "manifest",
            href: buildCdnUrl(webManifest),
        },
    },
] as const;

const headAssetsHtml = unsafeHtml(
    headAssets.map((item) => buildHtmlElementString(item)).join(""),
);

export const HeadAssetsTemplate = () => {
    return headAssetsHtml;
};
