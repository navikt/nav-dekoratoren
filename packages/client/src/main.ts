/// <reference types="./client.d.ts" />
import "vite/modulepreload-polyfill";
import { initAnalytics } from "./analytics/analytics";
import { initHistoryEvents, initScrollToEvents } from "./events";
import { addFaroMetaData } from "./faro";
import { refreshAuthData } from "./helpers/auth";
import { buildHtmlElement } from "./helpers/html-element-builder";
import { param, initParams } from "./params";
import "./main.css";

import.meta.glob("./styles/*.css", { eager: true });
import.meta.glob(["./views/**/*.ts", "!./views/**/*.test.ts"], { eager: true });

window.addEventListener("load", () => {
    addFaroMetaData();
});

const injectHeadAssets = () => {
    window.__DECORATOR_DATA__.headAssets?.forEach((props) => {
        const attribsSelector = Object.entries(props.attribs)
            .map(([name, value]) => `[${name}="${value}"]`)
            .join("");

        const elementExists = document.head.querySelector(
            `${props.tag}${attribsSelector}`,
        );

        if (!elementExists) {
            document.head.appendChild(buildHtmlElement(props));
        }
    });
};

const init = () => {
    initParams();
    injectHeadAssets();
    initHistoryEvents();
    initScrollToEvents();

    if (param("maskHotjar")) {
        document.documentElement.setAttribute("data-hj-suppress", "");
    }

    refreshAuthData().then((response) => {
        initAnalytics(response.auth);
    });
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
