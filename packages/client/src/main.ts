/// <reference types="./client.d.ts" />
import { getHeadAssetsProps } from "decorator-shared/head";
import { type Context } from "decorator-shared/params";
import Cookies from "js-cookie";
import "vite/modulepreload-polyfill";
import { initAnalytics } from "./analytics/analytics";
import { initAuth } from "./auth";
import { initHistoryEvents } from "./events";
import { addFaroMetaData } from "./faro";
import { buildHtmlElement } from "./helpers/html-element-builder";
import { cdnUrl } from "./helpers/urls";
import { initLogoutWarning } from "./logout-warning";
import "./main.css";
import { env, param, updateDecoratorParams } from "./params";
import { useLoadIfActiveSession } from "./screensharing";

import.meta.glob("./styles/*.css", { eager: true });
import.meta.glob(["./views/**/*.ts", "!./views/**/*.test.ts"], { eager: true });

updateDecoratorParams({});

window.addEventListener("activecontext", (event) => {
    updateDecoratorParams({
        context: (event as CustomEvent<{ context: Context }>).detail.context,
    });
});

// @TODO: Refactor loaders
window.addEventListener("load", () => {
    useLoadIfActiveSession({
        userState: Cookies.get("psCurrentState"),
    });
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
