import { HtmlElementProps } from "./types";

import faviconIco from "./head-assets/favicon.ico";
import faviconSvg from "./head-assets/favicon.svg";
import appleTouchIcon from "./head-assets/apple-touch-icon.png";
import webManifest from "./head-assets/site.webmanifest";

// TODO: include these in ssr

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
