import { createEvent } from "../events";
import cls from "../styles/consent-banner.module.css";
import utils from "../styles/utils.module.css";
import { defineCustomElement } from "./custom-elements";
import { isDialogDefined } from "../helpers/dialog-util";

export class ConsentBanner extends HTMLElement {
    dialog!: HTMLDialogElement;
    input!: HTMLInputElement;
    errorList!: HTMLElement;
    buttonConsentAll!: HTMLElement | null;
    buttonRefuseOptional!: HTMLElement | null;

    handleResponse = (
        response: "CONSENT_ALL_WEB_STORAGE" | "REFUSE_OPTIONAL_WEB_STORAGE",
    ) => {
        if (response === "CONSENT_ALL_WEB_STORAGE") {
            window.dispatchEvent(createEvent("consentAllWebStorage", {}));
        } else {
            window.dispatchEvent(createEvent("refuseOptionalWebStorage", {}));
        }
        this.closeModal();
    };

    showModal() {
        this.dialog.showModal();
        this.buttonConsentAll?.focus();
    }

    closeModal() {
        this.dialog.close();
    }

    checkOrWaitForWebStorageController() {
        if (window.webstorageController) {
            const givenConsent = window.webstorageController?.checkConsent();
            if (givenConsent === null) {
                this.showModal();
            }
        }

        setTimeout(() => {
            this.checkOrWaitForWebStorageController();
        }, 100);
    }

    async connectedCallback() {
        this.dialog = this.querySelector("dialog")!;
        if (!isDialogDefined(this.dialog)) {
            return;
        }

        this.buttonConsentAll = document.querySelector(
            '[data-name="consent-banner-all"]',
        );
        this.buttonRefuseOptional = document.querySelector(
            '[data-name="consent-banner-refuse-optional"]',
        );

        this.buttonConsentAll?.addEventListener("click", () =>
            this.handleResponse("CONSENT_ALL_WEB_STORAGE"),
        );
        this.buttonRefuseOptional?.addEventListener("click", () =>
            this.handleResponse("REFUSE_OPTIONAL_WEB_STORAGE"),
        );

        this.checkOrWaitForWebStorageController();
    }

    disconnectedCallback() {
        this.buttonConsentAll?.removeEventListener("click", () =>
            this.handleResponse("CONSENT_ALL_WEB_STORAGE"),
        );
        this.buttonRefuseOptional?.removeEventListener("click", () =>
            this.handleResponse("REFUSE_OPTIONAL_WEB_STORAGE"),
        );
    }
}

defineCustomElement("consent-banner", ConsentBanner);
