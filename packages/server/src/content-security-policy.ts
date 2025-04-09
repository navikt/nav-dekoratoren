import {
    BLOB,
    CSPDirectives,
    DATA,
    UNSAFE_EVAL,
    UNSAFE_INLINE,
    getCSP,
    SELF,
} from "csp-header";
import { clientEnv } from "./env/server";
import { isLocalhost } from "./urls";

const navNo = "*.nav.no";
const cdnNavNo = "cdn.nav.no";

const uxsignals = "widget.uxsignals.com";
const uxsignalsApi = "api.uxsignals.com";
const vergicScreenSharing = "*.psplugin.com";
const vergicDotCom = "www.vergic.com"; // seems to only be used for a single placeholder image
const boostChatbot = "*.boost.ai";
const boostScript = `${clientEnv.BOOST_ENV}.boost.ai`;
const vimeoPlayer = "player.vimeo.com"; // used for inline videos in the chat client
const qbrick = "video.qbrick.com"; // used for inline videos in the chat client
const vimeoCdn = "*.vimeocdn.com"; // used for video preview images

const hotjarCom = "*.hotjar.com";
const hotjarIo = "*.hotjar.io";
const skyra = "*.skyra.no";
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
    uxsignals,
    vergicScreenSharing,
    hotjarCom,
    skyra,
    taskAnalytics,
    boostScript,
    // localhost testing
    UNSAFE_INLINE, // vergic, hotjar
];

const workerSrc = [
    navNo,
    BLOB, // vergic
];

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
        skyra,
        cdnNavNo,
        googleFonts,
        googleFontsStatic,
        DATA, // ds-css
    ],
    "img-src": [
        navNo,
        uxsignals,
        vergicScreenSharing,
        vimeoCdn,
        hotjarCom,
        skyra,
        vergicDotCom,
    ],
    "frame-src": [hotjarCom, vimeoPlayer, qbrick, navNo],
    "frame-ancestors": [SELF, vergicScreenSharing],
    "connect-src": [
        navNo,
        uxsignalsApi,
        boostChatbot,
        vergicScreenSharing,
        hotjarCom,
        hotjarIo,
        skyra,
        taskAnalytics,
    ],
};

const localDirectives = Object.entries(directives).reduce(
    (acc, [key, value]) => ({
        ...acc,
        [key]: Array.isArray(value) ? [...value, "localhost:* ws:"] : value,
    }),
    {},
);

export const cspDirectives = isLocalhost() ? localDirectives : directives;

export const csp = getCSP({ presets: [cspDirectives] });
