/// <reference types="./client.d.ts" />
import { formatParams } from "decorator-shared/json";
import "vite/modulepreload-polyfill";
import { initAnalytics } from "./analytics/analytics";
import { initAuth } from "./auth";
import { initLogoutWarning } from "./logout-warning";
import { initHistoryEvents } from "./events";
import "./main.css";
import { env, param, updateDecoratorParams } from "./params";
import { getHeadAssetsProps } from "decorator-shared/head";
import { buildHtmlElement } from "./helpers/html-element-builder";
import { cdnUrl } from "./helpers/urls";
import { fetchAndRenderClientSide } from "./csr";
import { initWindowEventHandlers } from "./window-event-handlers";

import.meta.glob("./styles/*.css", { eager: true });
import.meta.glob(["./views/**/*.ts", "!./views/**/*.test.ts"], { eager: true });

updateDecoratorParams({});

const injectHeadAssets = () => {
    getHeadAssetsProps(cdnUrl).forEach((props) => {
        const element = buildHtmlElement(props);
        document.head.appendChild(element);
    });
};

const maskDocumentFromHotjar = () => {
    if (param("maskHotjar")) {
        document.documentElement.setAttribute("data-hj-suppress", "");
    }
};

const init = async () => {
    maskDocumentFromHotjar();
    injectHeadAssets();

    const authResponse = await initAuth();

    if (authResponse.buildId !== env("BUILD_ID")) {
        console.log(
            `Client build id ${env("BUILD_ID")} differs from server build id ${authResponse.buildId}`,
        );
        await fetchAndRenderClientSide(
            `${env("APP_URL")}/env?${formatParams(window.__DECORATOR_DATA__.params)}`,
        );
        return;
    }

    initWindowEventHandlers();
    initAnalytics(authResponse.auth);
    initHistoryEvents();

    if (param("logoutWarning")) {
        initLogoutWarning();
    }
};

const enableMocking = async () => {
    if (process.env.NODE_ENV !== "development") {
        return;
    }

    if (window.location.origin !== env("APP_URL")) {
        console.log(
            "Skipping mock worker as current origin is not decorator origin",
        );
        return;
    }

    const { worker } = await import("./mocks");

    return worker.start({
        onUnhandledRequest: "bypass",
    });
};

enableMocking().then(() => {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
});
