import { HtmlElementProps } from "./types";

import faviconIco from "./head/favicon.ico";
import faviconSvg from "./head/favicon.svg";
import appleTouchIcon from "./head/apple-touch-icon.png";
import webManifest from "./head/site.webmanifest";

export const headAssetsProps: HtmlElementProps[] = [
    {
        tag: "link",
        attribs: {
            rel: "icon",
            href: faviconIco,
            sizes: "any",
        },
    },
    {
        tag: "link",
        attribs: {
            rel: "icon",
            href: faviconSvg,
            type: "image/svg+xml",
        },
    },
    {
        tag: "link",
        attribs: {
            rel: "apple-touch-icon",
            href: appleTouchIcon,
        },
    },
    {
        tag: "link",
        attribs: {
            rel: "manifest",
            href: webManifest,
        },
    },
] as const;
