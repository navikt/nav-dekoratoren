import { createEvent } from "../events";
import { defineCustomElement } from "./custom-elements";
import { logger } from "../helpers/logger";

export class ConsentBanner extends HTMLElement {
    dialog!: HTMLDivElement;
    input!: HTMLInputElement;
    errorList!: HTMLElement;
    consentElement!: HTMLElement;
    buttonConsentAll!: HTMLElement | null;
    buttonRefuseOptional!: HTMLElement | null;
    buttonExpand!: HTMLElement | null;
    footerElement!: HTMLElement | null;

    // Enables reaping every listener registered on connect.
    #listeners: AbortController | null = null;

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

    showConsentArea() {
        this.footerElement!.before(this);
        this.scrollIntoView({ block: "start", behavior: "smooth" });
    }

    showModal() {
        const header = document.getElementById("consent_banner_title");
        if (header) {
            header.focus();
        }
        this.dialog.classList.add("consentBanner--open");
    }

    closeModal() {
        document.documentElement.classList.add("decorator-consent-decided");
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
            logger.error(
                "Could not find cookie consent banner dialog element.",
            );
            return;
        }

        this.dialog = dialog as HTMLDivElement;

        // connectedCallback can fire again if the element is moved in the DOM.
        this.#listeners?.abort();
        this.#listeners = new AbortController();
        const { signal } = this.#listeners;

        this.buttonConsentAll = document.querySelector(
            '[data-name="consent-banner-all"]',
        );
        this.buttonRefuseOptional = document.querySelector(
            '[data-name="consent-banner-refuse-optional"]',
        );
        this.buttonExpand = document.querySelector(
            '[data-name="consent-banner-expand"]',
        );
        this.footerElement = document.querySelector("decorator-footer");
        this.buttonConsentAll?.addEventListener(
            "click",
            () => this.handleResponse("CONSENT_ALL_WEB_STORAGE"),
            { signal },
        );
        this.buttonRefuseOptional?.addEventListener(
            "click",
            () => this.handleResponse("REFUSE_OPTIONAL_WEB_STORAGE"),
            { signal },
        );
        this.buttonExpand?.addEventListener(
            "click",
            () => {
                this.maximizeModal();
            },
            { signal },
        );

        window.addEventListener(
            "reshowConsentBanner",
            () => {
                this.showConsentArea();
            },
            { signal },
        );
    }

    disconnectedCallback() {
        this.#listeners?.abort();
        this.#listeners = null;
    }
}

defineCustomElement("consent-banner", ConsentBanner);
