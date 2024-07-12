/// <reference types="./client.d.ts" />
import { getHeadAssetsProps } from "decorator-shared/head";
import Cookies from "js-cookie";
import "vite/modulepreload-polyfill";
import { initAnalytics } from "./analytics/analytics";
import { initAuth } from "./auth";
import { initHistoryEvents } from "./events";
import { addFaroMetaData } from "./faro";
import { buildHtmlElement } from "./helpers/html-element-builder";
import { cdnUrl } from "./helpers/urls";
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
    getHeadAssetsProps(cdnUrl).forEach((props) => {
        const { tag, attribs } = props;

        const selector = Object.entries(attribs).reduce((acc, [key, value]) => {
            return `${acc}[${key}="${value}"]`;
        }, tag);

        console.log("Selector: ", selector);

        const elementExists = !!document.head.querySelector(selector);
        if (elementExists) {
            console.log("Element exists already, skipping", tag, attribs);
            return;
        }

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
