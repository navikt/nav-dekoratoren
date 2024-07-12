import { buildHtmlElementString } from "./lib/html-element-string-builder";
import { unsafeHtml } from "decorator-shared/html";
import { HtmlElementProps } from "decorator-shared/types";
import { buildCdnUrl } from "./urls";

// Assets from public folder
const faviconIco = "favicon.ico";
const faviconSvg = "favicon.svg";
const appleTouchIcon = "apple-touch-icon.png";
const webManifest = "site2.webmanifest";

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
