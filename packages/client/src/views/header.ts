import { endpointUrlWithParams } from "../helpers/urls";
import { env, param, updateDecoratorParams } from "../params";
import cls from "../styles/header.module.css";
import { defineCustomElement } from "./custom-elements";
import { refreshAuthData } from "../helpers/auth";
import { type ClientParams } from "decorator-shared/params";
import { CustomEvents } from "../events";
import { analyticsClickListener } from "../analytics/analytics";

const msgSafetyCheck = (message: MessageEvent) => {
    const { origin, source, data } = message;
    return (
        data.source === "decoratorClient" &&
        window.location.href.startsWith(origin) &&
        source === window
    );
};

const msgFromNks = (message: MessageEvent) => {
    const { origin, source, data } = message;
    return (
        data.source === "nksInnboks" &&
        window.location.href.startsWith(origin) &&
        source === window
    );
};

// TODO: this should probably include more params
const paramsUpdatesToHandle: Array<keyof ClientParams> = [
    "breadcrumbs",
    "availableLanguages",
    "utilsBackground",
    "language",
    "chatbotVisible",
    "context",
    "redirectOnUserChange",
    "pageType",
    "pageTheme",
] as const;

class Header extends HTMLElement {
    private userId?: string;

    private handleMessage = (e: MessageEvent) => {
        if (msgFromNks(e)) {
            const {
                event,
                payload: { pageType, pageTheme },
            } = e.data;
            if (event === "params" && (pageType || pageTheme)) {
                updateDecoratorParams({ pageTheme, pageType });
            }
        }

        if (!msgSafetyCheck(e)) {
            return;
        }

        const { event, payload } = e.data;

        if (event === "ready") {
            window.postMessage({ source: "decorator", event: "ready" });
            return;
        }

        if (event == "params") {
            paramsUpdatesToHandle.forEach((key) => {
                if (payload[key] !== undefined) {
                    // TODO: validation
                    updateDecoratorParams({
                        [key]: payload[key],
                    });
                }
            });
        }
    };

    private refreshHeader = () => {
        fetch(endpointUrlWithParams("/header"))
            .then((res) => res.text())
            .then((header) => (this.innerHTML = header))
            .then(() => refreshAuthData());
    };

    private handleParamsUpdated = (
        e: CustomEvent<CustomEvents["paramsupdated"]>,
    ) => {
        const { context, language } = e.detail.params;

        if (language) {
            this.refreshHeader();
            return;
        }

        if (context) {
            refreshAuthData();
        }
    };

    private handleAuthUpdated = (
        e: CustomEvent<CustomEvents["authupdated"]>,
    ) => {
        const currAuthUserId = e.detail.auth.authenticated
            ? e.detail.auth.userId
            : undefined;
        const storedUserId = this.userId;

        this.userId = currAuthUserId;

        if (storedUserId && storedUserId !== currAuthUserId) {
            this.userId = currAuthUserId;
            window.location.href = env("XP_BASE_URL");
        }
    };

    private handleFocus = async () => {
        await refreshAuthData();
    };

    private handleFocusIn = (e: FocusEvent) => {
        const headerContent = this.querySelector(`.${cls.siteheader}`);
        if (!headerContent?.contains(e.target as Node)) {
            this.dispatchEvent(new Event("closemenus", { bubbles: true }));
        }
    };

    connectedCallback() {
        window.addEventListener("message", this.handleMessage);
        window.addEventListener("paramsupdated", this.handleParamsUpdated);
        window.addEventListener("focusin", this.handleFocusIn);

        if (param("redirectOnUserChange")) {
            window.addEventListener("focus", this.handleFocus);
            window.addEventListener("authupdated", this.handleAuthUpdated);
        }

        this.addEventListener(
            "click",
            analyticsClickListener((anchor) =>
                anchor.classList.contains(cls.logo)
                    ? {
                          kategori: "dekorator-header",
                          lenketekst: "navlogo",
                      }
                    : null,
            ),
        );
    }

    disconnectedCallback() {
        window.removeEventListener("message", this.handleMessage);
        window.removeEventListener("paramsupdated", this.handleParamsUpdated);
        window.removeEventListener("authupdated", this.handleAuthUpdated);
        window.removeEventListener("focus", this.handleFocus);
        window.removeEventListener("focusin", this.handleFocusIn);
    }
}

defineCustomElement("decorator-header", Header);
