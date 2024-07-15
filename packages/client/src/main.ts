/// <reference types="./client.d.ts" />
import { getHeadAssetsProps } from "decorator-shared/head";
import "vite/modulepreload-polyfill";
import { initAnalytics } from "./analytics/analytics";
import { initHistoryEvents } from "./events";
import { addFaroMetaData } from "./faro";
import { initAuth } from "./helpers/auth";
import { buildHtmlElement } from "./helpers/html-element-builder";
import { cdnUrl } from "./helpers/urls";
import "./main.css";
import { param, updateDecoratorParams } from "./params";

import.meta.glob("./styles/*.css", { eager: true });
import.meta.glob(["./views/**/*.ts", "!./views/**/*.test.ts"], { eager: true });

updateDecoratorParams({});

// @TODO: Refactor loaders
window.addEventListener("load", () => {
    addFaroMetaData();
});

const injectHeadAssets = () => {
    getHeadAssetsProps(cdnUrl).forEach((props) => {
        const element = buildHtmlElement(props);
        document.head.appendChild(element);
    });
};

const init = () => {
    injectHeadAssets();
    initHistoryEvents();

    if (param("maskHotjar")) {
        document.documentElement.setAttribute("data-hj-suppress", "");
    }

    initAuth().then((auth) => {
        initAnalytics(auth);
    });
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
