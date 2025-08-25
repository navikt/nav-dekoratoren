import { createEvent } from "../events";
import { defineCustomElement } from "./custom-elements";

export class ConsentBanner extends HTMLElement {
    dialog!: HTMLDivElement;
    input!: HTMLInputElement;
    errorList!: HTMLElement;
    buttonConsentAll!: HTMLElement | null;
    buttonRefuseOptional!: HTMLElement | null;
    buttonExpand!: HTMLElement | null;

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
        const header = document.getElementById("consent_banner_title");
        if (header) {
            header.focus();
        }
        this.dialog.classList.add("consentBanner--open");
    }

    closeModal() {
        this.dialog.classList.remove("consentBanner--open");
    }

    minimizeModal() {
        this.dialog.classList.add("minimizedCookieBanner");
    }

    maximizeModal() {
        this.dialog.classList.remove("minimizedCookieBanner");
    }

    async connectedCallback() {
        const dialog = this.querySelector("#consent-banner-dialog");
        if (!dialog) {
            console.error(
                "Could not find cookie consent banner dialog element.",
            );
            return;
        }

        this.dialog = dialog as HTMLDivElement;

        this.buttonConsentAll = document.querySelector(
            '[data-name="consent-banner-all"]',
        );
        this.buttonRefuseOptional = document.querySelector(
            '[data-name="consent-banner-refuse-optional"]',
        );
        this.buttonExpand = document.querySelector(
            '[data-name="consent-banner-expand"]',
        );

        this.buttonConsentAll?.addEventListener("click", () =>
            this.handleResponse("CONSENT_ALL_WEB_STORAGE"),
        );
        this.buttonRefuseOptional?.addEventListener("click", () =>
            this.handleResponse("REFUSE_OPTIONAL_WEB_STORAGE"),
        );
        this.buttonExpand?.addEventListener("click", () => {
            this.maximizeModal();
        });

        window.addEventListener("showConsentBanner", () => {
            this.showModal();

            if (
                window.location.pathname.includes("informasjonskapsler") ||
                window.location.hash.includes("informasjonskapsler")
            ) {
                this.minimizeModal();
            }
        });
    }

    disconnectedCallback() {
        this.buttonConsentAll?.removeEventListener("click", () =>
            this.handleResponse("CONSENT_ALL_WEB_STORAGE"),
        );
        this.buttonRefuseOptional?.removeEventListener("click", () =>
            this.handleResponse("REFUSE_OPTIONAL_WEB_STORAGE"),
        );
        this.buttonExpand?.removeEventListener("click", () => {
            this.minimizeModal();
        });

        window.removeEventListener("showConsentBanner", () => {
            this.showModal();
        });
    }
}

defineCustomElement("consent-banner", ConsentBanner);
