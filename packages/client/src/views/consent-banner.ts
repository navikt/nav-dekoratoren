import {
    AvailableLanguage,
    Language,
    languageLabels,
} from "decorator-shared/params";
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
    buttonConfigure!: HTMLElement | null;

    handleResponse = (
        response: "CONSENT_ALL" | "REFUSE_OPTIONAL" | "CONFIGURE",
    ) => {
        console.log(response);
    };

    showModal() {
        this.dialog.showModal();
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
        if (!isDialogDefined(this.dialog)) {
            return;
        }

        this.buttonConsentAll = document.querySelector(
            '[data-name="consent-banner-all"]',
        );
        this.buttonRefuseOptional = document.querySelector(
            '[data-name="consent-banner-refuse-optional"]',
        );
        this.buttonConfigure = document.querySelector(
            '[data-name="consent-banner-configure"]',
        );

        this.buttonConsentAll?.addEventListener("click", () =>
            this.handleResponse("CONSENT_ALL"),
        );
        this.buttonRefuseOptional?.addEventListener("click", () =>
            this.handleResponse("REFUSE_OPTIONAL"),
        );
        this.buttonConfigure?.addEventListener("click", () =>
            this.handleResponse("CONFIGURE"),
        );
    }

    disconnectedCallback() {
        this.buttonConsentAll?.removeEventListener("click", () =>
            this.handleResponse("CONSENT_ALL"),
        );
        this.buttonRefuseOptional?.removeEventListener("click", () =>
            this.handleResponse("REFUSE_OPTIONAL"),
        );
        this.buttonConfigure?.removeEventListener("click", () =>
            this.handleResponse("CONFIGURE"),
        );
    }
}

defineCustomElement("consent-banner", ConsentBanner);
