import { amplitudeClickListener } from "../analytics/amplitude";
import { endpointUrlWithParams } from "../helpers/urls";
import { updateDecoratorParams } from "../params";
import cls from "../styles/header.module.css";
import { defineCustomElement } from "./custom-elements";
import { refreshAuthData } from "../helpers/auth";
import { ClientParams } from "decorator-shared/params";
import { CustomEvents } from "../events";

const msgSafetyCheck = (message: MessageEvent) => {
    const { origin, source, data } = message;
    return (
        data.source === "decoratorClient" &&
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
] as const;

class Header extends HTMLElement {
    private handleMessage = (e: MessageEvent) => {
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

    connectedCallback() {
        window.addEventListener("message", this.handleMessage);
        window.addEventListener("paramsupdated", this.handleParamsUpdated);

        this.addEventListener(
            "click",
            amplitudeClickListener((anchor) =>
                anchor.classList.contains(cls.logo)
                    ? { category: "dekorator-header", action: "navlogo" }
                    : null,
            ),
        );
    }

    disconnectedCallback() {
        window.removeEventListener("message", this.handleMessage);
        window.addEventListener("paramsupdated", this.handleParamsUpdated);
    }
}

defineCustomElement("decorator-header", Header);
