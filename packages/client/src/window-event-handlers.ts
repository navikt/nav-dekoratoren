import { env, param, updateDecoratorParams } from "./params";
import { formatParams } from "decorator-shared/json";
import type { Context, ParamKey, Params } from "decorator-shared/params";
import { createEvent } from "./events";
import { useLoadIfActiveSession } from "./screensharing";
import Cookies from "js-cookie";
import { addFaroMetaData } from "./faro";
import { fetchAndRenderClientSide } from "./csr";

const msgSafetyCheck = (message: MessageEvent) => {
    const { origin, source } = message;
    // Only allow messages from own window
    return window.location.href.startsWith(origin) && source === window;
};

export const initWindowEventHandlers = () => {
    window.addEventListener("paramsupdated", (e) => {
        const { language, context } = e.detail.params;

        if (language || context) {
            fetchAndRenderClientSide(
                `${env("APP_URL")}/env?${formatParams(window.__DECORATOR_DATA__.params)}`,
                true,
            );
        }
    });

    window.addEventListener("message", (e) => {
        if (!msgSafetyCheck(e)) {
            return;
        }
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
    });

    window.addEventListener("activecontext", (event) => {
        updateDecoratorParams({
            context: (event as CustomEvent<{ context: Context }>).detail
                .context,
        });
    });

    // @TODO: Refactor loaders
    window.addEventListener("load", () => {
        useLoadIfActiveSession({
            userState: Cookies.get("psCurrentState"),
        });
        addFaroMetaData();
    });
};
