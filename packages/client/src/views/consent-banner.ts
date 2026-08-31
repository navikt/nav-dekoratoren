import { createEvent } from "../events";
import { defineCustomElement } from "./custom-elements";
import { logger } from "../helpers/logger";

/*
    WebStorageController owns state for this, which is set on data-decorator-consent
*/
export class ConsentBanner extends HTMLElement {
    buttonConsentAll!: HTMLElement | null;
    buttonRefuseOptional!: HTMLElement | null;

    #listeners: AbortController | null = null;

    handleResponse = (
        response: "CONSENT_ALL_WEB_STORAGE" | "REFUSE_OPTIONAL_WEB_STORAGE",
    ) => {
        if (response === "CONSENT_ALL_WEB_STORAGE") {
            window.dispatchEvent(createEvent("consentAllWebStorage", {}));
        } else {
            window.dispatchEvent(createEvent("refuseOptionalWebStorage", {}));
        }
    };

    focusBanner() {
        this.querySelector<HTMLElement>("#consent_banner_title")?.focus();
    }

    async connectedCallback() {
        if (!this.querySelector("#consent-banner-dialog")) {
            logger.error(
                "Could not find cookie consent banner dialog element.",
            );
            return;
        }

        this.#listeners?.abort();
        this.#listeners = new AbortController();
        const { signal } = this.#listeners;

        this.buttonConsentAll = this.querySelector(
            '[data-name="consent-banner-all"]',
        );
        this.buttonRefuseOptional = this.querySelector(
            '[data-name="consent-banner-refuse-optional"]',
        );

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

        window.addEventListener(
            "reshowConsentBanner",
            () => {
                this.focusBanner();
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
