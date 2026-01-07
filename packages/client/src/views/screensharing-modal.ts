import Cookies from "js-cookie";
import loadExternalScript from "../helpers/load-external-script";
import { env, param } from "../params";
import clsInputs from "../styles/inputs.module.css";
import { defineCustomElement } from "./custom-elements";
import { isDialogDefined } from "../helpers/dialog-util";
import { analyticsEvent } from "../analytics/analytics";
import { logger } from "decorator-shared/logger";
import {
    loadPuzzelScript,
    ScreenshareButtonPuzzel,
    ScreensharingModalPuzzel,
} from "./screensharing-modal-puzzel";

let scriptHasLoaded = false;

const loadScript = () =>
    loadExternalScript(
        `https://account.psplugin.com/${env("PUZZEL_CUSTOMER_ID")}/ps.js`,
    );

function lazyLoadScreensharing(openModal: () => void) {
    // Check if it is already loaded to avoid layout shift
    const enabled =
        window.__DECORATOR_DATA__.params.shareScreen &&
        window.__DECORATOR_DATA__.features["dekoratoren.skjermdeling"];

    if (!enabled || scriptHasLoaded) {
        openModal();
        return;
    }

    loadScript().then(() => {
        if (!window.vngage) {
            logger.error("vngage not found!");
            return;
        }

        window.vngage.subscribe("app.ready", (message, data) => {
            logger.info("Screensharing app vergic ready", { message, data });

            scriptHasLoaded = true;
            openModal();
        });
    });
}

function startCall(code: string) {
    window.vngage.join("queue", {
        opportunityId: "615FF5E7-37B7-4697-A35F-72598B0DC53B",
        solutionId: "5EB316A1-11E2-460A-B4E3-F82DBD13E21D",
        caseTypeId: "66D660EF-6F14-44B4-8ADE-A70A127202D0",
        category: "Phone2Web",
        message: "Phone2Web",
        groupId: "A034081B-6B73-46B7-BE27-23B8E9CE3079",
        startCode: code,
    });
    analyticsEvent({
        eventName: "skjermdeling",
        kategori: "dekorator-footer",
        komponent: "ScreensharingModal",
    });
}

export class ScreensharingModal extends HTMLElement {
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
        if (!/^\d{5}$/.exec(code)) {
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

        this.dialog = this.querySelector("dialog")!;
        this.errorList = this.querySelector("ul")!;
        this.input = this.querySelector("input")!;
        if (!isDialogDefined(this.dialog)) {
            return;
        }

        this.input.addEventListener("input", () => this.clearErrors());

        const form = this.querySelector("form")!;
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const code = new FormData(form).get("screensharing_code");
            if (typeof code === "string" && this.validateInput(code)) {
                startCall(code);
                this.closeModal();
            }
        });

        this.querySelector("button[data-type=cancel]")?.addEventListener(
            "click",
            () => this.closeModal(),
        );
    }
}

class ScreenshareButton extends HTMLElement {
    loadScriptIfActiveSession = () => {
        const userState = Cookies.get("psCurrentState");
        if (userState && userState !== "Ready") {
            loadScript();
        }

        logger.info("Checking for active puzzle chat session");
        const puzzleChatSession = Cookies.get("pzl.rid");
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
                logger.info("Opening vergic screensharing modal");
                const dialog = document.querySelector(
                    "screensharing-modal",
                ) as HTMLDialogElement;

                dialog.showModal();
            }),
        );
    }
}

const urlParams = new URLSearchParams(window.location.search);
const enablePuzzel = urlParams.get("enablePuzzel");

defineCustomElement(
    "screensharing-modal",
    enablePuzzel ? ScreensharingModalPuzzel : ScreensharingModal,
);
defineCustomElement(
    "screenshare-button",
    enablePuzzel ? ScreenshareButtonPuzzel : ScreenshareButton,
);
