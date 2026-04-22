import { endpointUrlWithParams } from "../helpers/urls";
import { type ClientParams, paramsSchema } from "decorator-shared/params";
import { logger } from "decorator-shared/logger";
import { env, param, updateDecoratorParams } from "../params";
import { defineCustomElement } from "./custom-elements";
import { refreshAuthData } from "../helpers/auth";
import { CustomEvents } from "../events";
import { analyticsClickListener } from "../analytics/analytics";

import cls from "../styles/header.module.css";

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
    "simple",
    "simpleHeader",
] as const;

class Header extends HTMLElement {
    private userId?: string;

    private readonly handleMessage = (e: MessageEvent) => {
        if (msgFromNks(e)) {
            const {
                event,
                payload: { pageType, pageTheme, pageTitle, breadcrumbs },
            } = e.data;
            if (event === "params") {
                const updates: Partial<ClientParams> = {
                    ...(pageType && { pageType }),
                    ...(pageTheme && { pageTheme }),
                    ...(pageTitle && { pageTitle }),
                    ...(breadcrumbs && { breadcrumbs }),
                };
                const validated = paramsSchema.partial().safeParse(updates);
                if (
                    validated.success &&
                    Object.keys(validated.data).length > 0
                ) {
                    updateDecoratorParams(validated.data);
                } else if (!validated.success) {
                    logger.warn("Invalid params from NKS postMessage", {
                        error: validated.error,
                    });
                }
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
            const updates = Object.fromEntries(
                paramsUpdatesToHandle
                    .filter((key) => payload[key] !== undefined)
                    .map((key) => [key, payload[key]]),
            ) as Partial<ClientParams>;
            const validated = paramsSchema.partial().safeParse(updates);
            if (validated.success && Object.keys(validated.data).length > 0) {
                updateDecoratorParams(validated.data);
            } else if (!validated.success) {
                logger.warn("Invalid params from postMessage", {
                    error: validated.error,
                });
            }
        }
    };

    private readonly refreshHeader = () => {
        fetch(endpointUrlWithParams("/header"))
            .then((res) => res.text())
            .then((header) => (this.innerHTML = header))
            .then(() => refreshAuthData())
            .then(() =>
                this.dispatchEvent(
                    new Event("recheckConsentBanner", { bubbles: true }),
                ),
            );
    };

    private readonly handleParamsUpdated = (
        e: CustomEvent<CustomEvents["paramsupdated"]>,
    ) => {
        const { changedKeys } = e.detail;
        const isSimpleChange = changedKeys.includes("simple");
        const isSimpleHeaderChange = changedKeys.includes("simpleHeader");

        if (
            changedKeys.includes("language") ||
            isSimpleChange ||
            isSimpleHeaderChange
        ) {
            this.refreshHeader();
            return;
        }
        if (changedKeys.includes("context")) {
            refreshAuthData();
        }
    };

    private readonly handleAuthUpdated = (
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

    private readonly handleFocus = async () => {
        await refreshAuthData();
    };

    private readonly handleFocusIn = (e: FocusEvent) => {
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
