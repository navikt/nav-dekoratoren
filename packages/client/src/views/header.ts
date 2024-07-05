import { ParamKey } from "decorator-shared/params";
import { defineCustomElement } from "../custom-elements";
import { env, updateDecoratorParams } from "../params";
import { createEvent } from "../events";
import { formatParams } from "decorator-shared/json";

const msgSafetyCheck = (message: MessageEvent) => {
    const { origin, source } = message;
    return window.location.href.startsWith(origin) && source === window;
};

class Header extends HTMLElement {
    handleMessage = (e: MessageEvent) => {
        if (!msgSafetyCheck(e)) {
            return;
        }
        if (e.data.source === "decoratorClient" && e.data.event === "ready") {
            window.postMessage({ source: "decorator", event: "ready" });
        }
        if (e.data.source === "decoratorClient" && e.data.event == "params") {
            const payload = e.data.payload;

            console.log("handling message", payload);

            (
                [
                    "breadcrumbs",
                    "availableLanguages",
                    "utilsBackground",
                    "language",
                    "chatbotVisible",
                ] satisfies ParamKey[]
            ).forEach((key) => {
                if (payload[key] !== undefined) {
                    updateDecoratorParams({
                        [key]: payload[key],
                    });
                }
            });

            if (e.data.payload.context) {
                const context = e.data.payload.context;
                if (
                    [
                        "privatperson",
                        "arbeidsgiver",
                        "samarbeidspartner",
                    ].includes(context)
                ) {
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
