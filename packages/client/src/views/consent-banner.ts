import { createEvent } from "../events";
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

        window.addEventListener("showConsentBanner", () => {
            this.showModal();
        });
    }

    disconnectedCallback() {
        this.buttonConsentAll?.removeEventListener("click", () =>
            this.handleResponse("CONSENT_ALL_WEB_STORAGE"),
        );
        this.buttonRefuseOptional?.removeEventListener("click", () =>
            this.handleResponse("REFUSE_OPTIONAL_WEB_STORAGE"),
        );

        window.removeEventListener("showConsentBanner", () => {
            this.showModal();
        });
    }
}

defineCustomElement("consent-banner", ConsentBanner);
