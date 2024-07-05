import { formatParams } from "decorator-shared/json";
import { defineCustomElement } from "../custom-elements";
import { env, updateDecoratorParams } from "../params";

const msgSafetyCheck = (message: MessageEvent) => {
    const { origin, source } = message;
    return window.location.href.startsWith(origin) && source === window;
};

class Header extends HTMLElement {
    handleMessage = (e: MessageEvent) => {
        if (!msgSafetyCheck(e)) {
            return;
        } else if (
            e.data.source === "decoratorClient" &&
            e.data.event === "ready"
        ) {
            window.postMessage({ source: "decorator", event: "ready" });
        } else if (
            e.data.source === "decoratorClient" &&
            e.data.event == "params"
        ) {
            const payload = e.data.payload;

            [
                "breadcrumbs",
                "availableLanguages",
                "utilsBackground",
                "language",
                "chatbotVisible",
                "context",
            ].forEach((key) => {
                if (payload[key] !== undefined) {
                    // TODO: validation
                    updateDecoratorParams({
                        [key]: payload[key],
                    });
                }
            });
        }
    };

    handleParamsUpdated = (e: CustomEvent) => {
        if (e.detail.params.language) {
            fetch(
                `${env("APP_URL")}/header?${formatParams(window.__DECORATOR_DATA__.params)}`,
            )
                .then((res) => res.text())
                .then((header) => (this.innerHTML = header));
        }
    };

    connectedCallback() {
        window.addEventListener("message", this.handleMessage);
        window.addEventListener("paramsupdated", this.handleParamsUpdated);
    }

    disconnectedCallback() {
        window.removeEventListener("message", this.handleMessage);
        window.addEventListener("paramsupdated", this.handleParamsUpdated);
    }
}

defineCustomElement("decorator-header", Header);
