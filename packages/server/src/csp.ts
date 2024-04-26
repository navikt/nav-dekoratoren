import {
    CSPDirectives,
    UNSAFE_EVAL,
    UNSAFE_INLINE,
    BLOB,
    DATA,
    getCSP,
} from "csp-header";
import { Handler, responseBuilder } from "./lib/handler";
import { env } from "./env/server";

const navNo = "*.nav.no";
const cdnNavNo = "cdn.nav.no";

const vergicScreenSharing = "*.psplugin.com";
const vergicDotCom = "www.vergic.com"; // seems to only be used for a single placeholder image
const boostChatbot = "*.boost.ai";
const boostScript =
    process.env.ENV === "prod" ? "nav.boost.ai" : "navtest.boost.ai";
const vimeoPlayer = "player.vimeo.com"; // used for inline videos in the chat client
const qbrick = "video.qbrick.com"; // used for inline videos in the chat client
const vimeoCdn = "*.vimeocdn.com"; // used for video preview images

const hotjarCom = "*.hotjar.com";
const hotjarIo = "*.hotjar.io";
const taskAnalytics = "*.taskanalytics.com";
const googleFonts = "*.googleapis.com";
const googleFontsStatic = "*.gstatic.com";

const styleSrc = [
    navNo,
    vergicScreenSharing,
    UNSAFE_INLINE, // various components with style-attributes,
    googleFonts,
    googleFontsStatic,
];

const scriptSrc = [
    navNo,
    vergicScreenSharing,
    hotjarCom,
    taskAnalytics,
    boostScript,
    // localhost testing
    UNSAFE_INLINE, // vergic, hotjar
];

const workerSrc = [
    navNo,
    BLOB, // vergic
];

// @TODO: Merge with bun responses

const directives: Partial<CSPDirectives> = {
    "default-src": [navNo],
    "script-src": [
        ...scriptSrc,
        UNSAFE_EVAL, // vergic
    ],
    "script-src-elem": scriptSrc,
    "worker-src": workerSrc,
    "child-src": workerSrc, // for browsers lacking support for worker-src
    "style-src": styleSrc,
    "style-src-elem": styleSrc,
    "font-src": [
        vergicScreenSharing,
        hotjarCom,
        cdnNavNo,
        googleFonts,
        googleFontsStatic,
        DATA, // ds-css
    ],
    "img-src": [navNo, vergicScreenSharing, vimeoCdn, hotjarCom, vergicDotCom],
    "frame-src": [hotjarCom, vimeoPlayer, qbrick, navNo],
    "connect-src": [
        navNo,
        boostChatbot,
        vergicScreenSharing,
        hotjarCom,
        hotjarIo,
        taskAnalytics,
    ],
};

const localDirectives = Object.entries(directives).reduce(
    (acc, [key, value]) => {
        return {
            ...acc,
            [key]: Array.isArray(value) ? [...value, "localhost:* ws:"] : value,
        };
    },
    {},
);

export const cspDirectives =
    env.ENV === "localhost" ? localDirectives : directives;
export const csp = getCSP({
    presets: [cspDirectives],
});

export const cspHandler: Handler = {
    method: "GET",
    path: "/api/csp",
    handler: () => {
        return responseBuilder().json(cspDirectives).build();
    },
};
