/// <reference types="./client.d.ts" />
import { formatParams } from "decorator-shared/json";
import { type Context, type ParamKey } from "decorator-shared/params";
import Cookies from "js-cookie";
import "vite/modulepreload-polyfill";
import { initAnalytics } from "./analytics/analytics";
import { initAuth } from "./auth";
import { logoutWarningController } from "./controllers/logout-warning";
import { createEvent, initHistoryEvents } from "./events";
import { addFaroMetaData } from "./faro";
import "./main.css";
import { env, hasParam, param, updateDecoratorParams } from "./params";
import { useLoadIfActiveSession } from "./screensharing";
import "./views/breadcrumb";
import "./views/chatbot-wrapper";
import "./views/context-link";
import "./views/decorator-utils";
import "./views/dropdown-menu";
import "./views/feedback";
import "./views/language-selector";
import "./views/lenke-med-sporing";
import "./views/loader";
import "./views/local-time";
import "./views/login-button";
import "./views/main-menu";
import "./views/menu-background";
import "./views/notifications";
import "./views/ops-messages";
import "./views/screensharing-modal";
import "./views/search-input";
import "./views/search-menu";
import "./views/skip-link";
import "./views/sticky";
import "./views/user-menu";

import.meta.glob("./styles/*.css", { eager: true });

// Just for testing
export const CONTEXTS = [
    "privatperson",
    "arbeidsgiver",
    "samarbeidspartner",
] as const;

updateDecoratorParams({});

window.addEventListener("paramsupdated", (e) => {
    if (e.detail.params.language) {
        Promise.all(
            ["header", "footer"].map((key) =>
                fetch(
                    `${env("APP_URL")}/${key}?${formatParams(window.__DECORATOR_DATA__.params)}`,
                ).then((res) => res.text()),
            ),
        ).then(([header, footer]) => {
            const headerEl = document.getElementById("decorator-header");
            const footerEl = document.getElementById("decorator-footer");
            if (headerEl && footerEl) {
                headerEl.outerHTML = header;
                footerEl.outerHTML = footer;
                init();
            }
        });
    }
});

window.addEventListener("message", (e) => {
    if (e.data.source === "decoratorClient" && e.data.event === "ready") {
        window.postMessage({ source: "decorator", event: "ready" });
    }
    if (e.data.source === "decoratorClient" && e.data.event == "params") {
        const payload = e.data.payload;

        (
            [
                "breadcrumbs",
                "availableLanguages",
                "utilsBackground",
                "language",
            ] satisfies ParamKey[]
        ).forEach((key) => {
            if (payload[key]) {
                updateDecoratorParams({
                    [key]: payload[key],
                });
            }
        });

        if (e.data.payload.context) {
            const context = e.data.payload.context;
            if (CONTEXTS.includes(context)) {
                window.dispatchEvent(
                    createEvent("activecontext", {
                        bubbles: true,
                        detail: { context },
                    }),
                );
            } else {
                console.warn("Unrecognized context", context);
            }
        }
    }
});

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

const init = async () => {
    initHistoryEvents();
    if (param("maskHotjar")) {
        document.documentElement.setAttribute("data-hj-suppress", "");
    }
    initAuth().then((auth) => {
        initAnalytics(auth);
    });

    if (hasParam("logoutWarning")) {
        logoutWarningController(
            param("logoutWarning"),
            window.__DECORATOR_DATA__.texts,
        );
    }
};

async function enableMocking() {
    if (process.env.NODE_ENV !== "development") {
        return;
    }

    const { worker } = await import("./mocks");

    return worker.start({ onUnhandledRequest: "bypass" });
}

enableMocking().then(() => init());
