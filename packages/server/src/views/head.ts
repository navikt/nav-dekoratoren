import { getHeadAssetsProps } from "decorator-shared/head";
import { buildHtmlElementString } from "../lib/html-element-string-builder";
import { buildCdnUrl } from "../urls";
import { unsafeHtml } from "decorator-shared/html";

export const buildHeadSsrElements = () => {
    return getHeadAssetsProps(buildCdnUrl)
        .map((item) => buildHtmlElementString(item))
        .join("");
};

const headHtml = unsafeHtml(buildHeadSsrElements());

export const HeadTemplate = () => {
    return headHtml;
};
