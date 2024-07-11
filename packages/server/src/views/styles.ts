import { env } from "../env/server";
import { buildHtmlElementString } from "../lib/html-element-string-builder";
import { unsafeHtml } from "decorator-shared/html";
import { buildCdnUrl } from "../urls";

export const getCSSUrl = async () => {
    const manifest = (await import("decorator-client/dist/.vite/manifest.json"))
        .default;

    return buildCdnUrl(manifest["src/main.ts"].css[0]);
};

const getCssElementAsString = async () => {
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

const cssElementAsString = await getCssElementAsString();

export const StylesTemplate = () => {
    return unsafeHtml(`${cssElementAsString}`);
};
