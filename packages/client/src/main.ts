/// <reference types="./client.d.ts" />
import "vite/modulepreload-polyfill";
import { initAnalytics } from "./analytics/analytics";
import { initHistoryEvents, initScrollToEvents } from "./events";
import { addFaroMetaData } from "./faro";
import { refreshAuthData } from "./helpers/auth";
import { buildHtmlElement } from "./helpers/html-element-builder";
import { param, initParams } from "./params";
import "./main.css";
import { WebStorageController } from "./webStorage";

import.meta.glob("./styles/*.css", { eager: true });
import.meta.glob(["./views/**/*.ts", "!./views/**/*.test.ts"], { eager: true });

window.addEventListener("load", () => {
    addFaroMetaData();
});

window.webStorageController = new WebStorageController();

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

const initTrackingServices = () => {
    if (typeof window.initContitionalHotjar === "function") {
        window.initContitionalHotjar();
    }

    refreshAuthData().then((response) => {
        console.log("initing analytics");
        initAnalytics(response.auth);
    });
};

const initConsentListener = () => {
    window.addEventListener("consentAllWebStorage", () => {
        initTrackingServices();
        window.removeEventListener("consentAllWebStorage", () => {
            initTrackingServices();
        });
    });
};

const init = () => {
    initParams();
    injectHeadAssets();
    initHistoryEvents();
    initScrollToEvents();
    initConsentListener();

    const { consent } = window.webStorageController.getCurrentConsent();

    // This is just a parameter, so does not affect or interfer with users
    // cookie consent or withdrawal of consent.
    if (param("maskHotjar")) {
        document.documentElement.setAttribute("data-hj-suppress", "");
    }

    if (consent?.analytics) {
        initTrackingServices();
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
