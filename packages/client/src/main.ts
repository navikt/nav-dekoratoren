/// <reference types="./client.d.ts" />
import "vite/modulepreload-polyfill";
import {
    initAnalytics,
    mockAmplitude,
    stopAnalytics,
} from "./analytics/analytics";
import { initHistoryEvents, initScrollToEvents } from "./events";
import { addFaroMetaData } from "./faro";
import { refreshAuthData } from "./helpers/auth";
import { buildHtmlElement } from "./helpers/html-element-builder";
import { param, initParams } from "./params";
import { WebStorageController } from "./webStorage";
import "./main.css";
import { initHotjar, stopHotjar } from "./analytics/hotjar";
import { initSkyra, stopSkyra } from "./analytics/skyra";

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

const startTrackingServices = () => {
    if (param("maskHotjar")) {
        document.documentElement.setAttribute("data-hj-suppress", "");
    }

    initHotjar();
    initSkyra();

    refreshAuthData().then((response) => {
        initAnalytics(response.auth);
    });
};

const stopTrackingServices = () => {
    stopHotjar();
    stopSkyra();

    refreshAuthData().then((response) => {
        stopAnalytics(response.auth);
    });
};

/* Listen for consent events sent from the consent-banner */
const initConsentListener = () => {
    window.addEventListener("consentAllWebStorage", () => {
        startTrackingServices();
    });
    window.addEventListener("refuseOptionalWebStorage", () => {
        stopTrackingServices();
    });
};

const init = () => {
    initParams();
    injectHeadAssets();
    initHistoryEvents();
    initScrollToEvents();
    initConsentListener();

    refreshAuthData();

    window.dekoratorenIsReady = () => true;
    // Blir overskrevet dersom vi får ov til å starte Amplitude etter samtykke
    window.dekoratorenAmplitude = mockAmplitude;

    const { consent } = window.webStorageController.getCurrentConsent();

    if (consent?.analytics) {
        startTrackingServices();
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
