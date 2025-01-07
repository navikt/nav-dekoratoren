import { AvailableLanguage, Language } from "decorator-shared/params";
import { CustomEvents } from "../events";
import { param, updateDecoratorParams } from "../params";
import cls from "../styles/consent-banner.module.css";
import utils from "../styles/utils.module.css";
import { defineCustomElement } from "./custom-elements";
import { amplitudeEvent } from "../analytics/amplitude";
import { isDialogDefined } from "../helpers/dialog-util";

export class ConsentBanner extends HTMLElement {
    dialog!: HTMLDialogElement;
    input!: HTMLInputElement;
    errorList!: HTMLElement;
    buttonConsentAll!: HTMLElement | null;
    buttonRefuseOptional!: HTMLElement | null;

    handleResponse = (response: "CONSENT_ALL" | "REFUSE_OPTIONAL") => {
        if (response === "CONSENT_ALL") {
            // Separate cookie controller?
        }
    };

    showModal() {
        this.dialog.showModal();
        console.log("showModal");
        amplitudeEvent({
            eventName: "modal åpnet",
            kategori: "dekorator-footer",
            lenketekst: "Vis samtykkebanner",
            komponent: "ConsentBanner",
        });
    }

    closeModal() {
        this.dialog.close();
        amplitudeEvent({
            eventName: "modal lukket",
            kategori: "dekorator-footer",
            lenketekst: "Skjul samtykkebanner",
            komponent: "ConsentBanner",
        });
    }

    async connectedCallback() {
        this.dialog = this.querySelector("dialog")!;
        console.log(this);
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
            this.handleResponse("CONSENT_ALL"),
        );
        this.buttonRefuseOptional?.addEventListener("click", () =>
            this.handleResponse("REFUSE_OPTIONAL"),
        );

        this.showModal();
    }

    disconnectedCallback() {
        this.buttonConsentAll?.removeEventListener("click", () =>
            this.handleResponse("CONSENT_ALL"),
        );
        this.buttonRefuseOptional?.removeEventListener("click", () =>
            this.handleResponse("REFUSE_OPTIONAL"),
        );
    }
}

defineCustomElement("consent-banner", ConsentBanner);
