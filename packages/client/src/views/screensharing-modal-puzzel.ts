import Cookies from "js-cookie";
import { screensharingModalSelector } from "decorator-shared/views/screensharing-modal";
import { param } from "../params";
import clsInputs from "../styles/inputs.module.css";
import { isDialogDefined } from "../helpers/dialog-util";
import { analyticsEvent } from "../analytics/analytics";
import { logger } from "decorator-shared/logger";
import { getRequiredElement } from "../helpers/dom";

let scriptLoaded: Promise<void> | undefined;

/**
 * ETTER TESTING:
 * 1. Fikse den avslutt-chat boksen
 * 2. Sjekke config-parameterene som sendes inn, customerID, queueKey, interactionId
 */
export const loadPuzzelScript = (): Promise<void> => {
    logger.info("Loading Puzzel script");
    if (scriptLoaded) {
        return scriptLoaded;
    }
    const script = document.createElement("script");
    script.async = true;
    script.type = "text/javascript";
    script.src = "https://app-cdn.puzzel.com/public/js/pzl_loader.js";
    script.setAttribute("id", "pzlModuleLoader");
    script.setAttribute("data-customer-id", "41155");
    const promise = new Promise<void>((resolve) => {
        script.onload = () => {
            resolve();
        };
    });
    scriptLoaded = promise;
    document.body.appendChild(script);
    return promise;
};

function lazyLoadScreensharing(openModal: () => void) {
    logger.info("Lazy loading puzzel screensharing");
    // Check if it is already loaded to avoid layout shift
    const enabled =
        window.__DECORATOR_DATA__.params.shareScreen &&
        window.__DECORATOR_DATA__.features["dekoratoren.skjermdeling"] &&
        window.__DECORATOR_DATA__.features["dekoratoren.puzzel-script"];

    if (!enabled || window.pzl?.info?.status === "started") {
        openModal();
        return;
    }
    logger.info("Screensharing enabled, loading puzzel script");
    loadPuzzelScript().then(() => {
        openModal();
    });
}

function startCall(code: string) {
    window.pzl?.api.showInteraction({
        interactionId: "7d05c34f-0db4-4fc3-b370-9eb1812a40ca",
        queueKey: "q_cobrowsing_demo",
        formValues: {
            pzlStartChatCode: code,
        },
    });

    analyticsEvent({
        eventName: "skjermdeling",
        kategori: "dekorator-footer",
        komponent: "ScreensharingModal",
    });
}

export class ScreensharingModalPuzzel extends HTMLElement {
    dialog!: HTMLDialogElement;
    input!: HTMLInputElement;
    errorList!: HTMLElement;

    showModal() {
        this.dialog.showModal();
        analyticsEvent({
            eventName: "modal åpnet",
            kategori: "dekorator-footer",
            tekst: "Start skjermdeling",
            komponent: "ScreensharingModal",
        });
    }
    closeModal() {
        this.dialog.close();
        analyticsEvent({
            eventName: "modal lukket",
            kategori: "dekorator-footer",
            tekst: "Start skjermdeling",
            komponent: "ScreensharingModal",
        });
    }

    validateInput(code: string) {
        if (!/^\d{6}$/.exec(code)) {
            this.input.classList.add(clsInputs.invalid);
            this.errorList.classList.add(clsInputs.showErrors);
            return false;
        }
        return true;
    }

    clearErrors() {
        this.errorList.classList.remove(clsInputs.showErrors);
    }

    async connectedCallback() {
        if (!param("shareScreen")) {
            return;
        }

        this.dialog = getRequiredElement(
            this,
            screensharingModalSelector.dialog,
        );
        if (!isDialogDefined(this.dialog)) {
            return;
        }
        if (this.dialog.dataset.status !== "enabled") {
            return;
        }

        this.errorList = getRequiredElement(
            this,
            screensharingModalSelector.errors,
        );
        this.input = getRequiredElement(this, screensharingModalSelector.input);

        this.input.addEventListener("input", () => this.clearErrors());

        const form = getRequiredElement<HTMLFormElement>(
            this,
            screensharingModalSelector.form,
        );
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const code = new FormData(form).get("screensharing_code");
            if (typeof code === "string" && this.validateInput(code)) {
                startCall(code);
                this.closeModal();
            }
        });

        getRequiredElement(
            this,
            screensharingModalSelector.cancel,
        ).addEventListener("click", () => this.closeModal());
    }
}

export class ScreenshareButtonPuzzel extends HTMLElement {
    loadScriptIfActiveSession = () => {
        logger.info("Checking for active puzzle chat session");
        const puzzleChatSession = Cookies.get("pzl.rid");
        logger.info(`puzzleChatSession: ${puzzleChatSession}`);
        if (
            puzzleChatSession &&
            window.__DECORATOR_DATA__.features["dekoratoren.puzzel-script"]
        ) {
            loadPuzzelScript();
        }
    };

    connectedCallback() {
        if (document.readyState == "complete") {
            this.loadScriptIfActiveSession();
        } else {
            window.addEventListener("load", () => {
                this.loadScriptIfActiveSession();
            });
        }
        this.addEventListener("click", () =>
            lazyLoadScreensharing(() => {
                const dialog = getRequiredElement<ScreensharingModalPuzzel>(
                    document,
                    "screensharing-modal",
                );
                logger.info("Opening puzzel screensharing modal");

                dialog.showModal();
            }),
        );
    }
}
