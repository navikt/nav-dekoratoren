/// <reference types="./client.d.ts" />
import Cookies from "js-cookie";
import "vite/modulepreload-polyfill";
import { initAnalytics } from "./analytics/analytics";
import { initAuth } from "./auth";
import { initHistoryEvents } from "./events";
import { addFaroMetaData } from "./faro";
import { buildHtmlElement } from "./helpers/html-element-builder";
import "./main.css";
import { param, updateDecoratorParams } from "./params";
import { useLoadIfActiveSession } from "./screensharing";

import.meta.glob("./styles/*.css", { eager: true });
import.meta.glob(["./views/**/*.ts", "!./views/**/*.test.ts"], { eager: true });

updateDecoratorParams({});

// @TODO: Refactor loaders
window.addEventListener("load", () => {
    useLoadIfActiveSession({
        userState: Cookies.get("psCurrentState"),
    });
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
