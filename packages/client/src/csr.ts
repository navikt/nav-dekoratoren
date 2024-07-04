import { buildHtmlElement } from "./helpers/html-element-builder";
import type { CsrPayload } from "decorator-shared/types";

export const fetchAndRenderClientSide = async (url: string) => {
    const csrAssets = await fetch(url)
        .then((res) => res.json() as Promise<CsrPayload>)
        .catch((e) => {
            console.error("Error fetching CSR assets: ", e);
            return null;
        });

    if (!csrAssets) {
        console.error("Failed to fetch CSR assets!");
        return;
    }

    const headerEl = document.getElementById("decorator-header");
    if (headerEl) {
        headerEl.outerHTML = csrAssets.header;
    }

    const footerEl = document.getElementById("decorator-footer");
    if (footerEl) {
        footerEl.outerHTML = csrAssets.footer;
    }

    window.__DECORATOR_DATA__ = csrAssets.data;

    csrAssets.css.map(buildHtmlElement).forEach((cssElement) => {
        document.head.appendChild(cssElement);
    });

    csrAssets.scripts.map(buildHtmlElement).forEach((scriptElement) => {
        document.body.appendChild(scriptElement);
    });
};
