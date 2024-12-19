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

    showModal() {
        console.log("show modal");
        console.log(this.dialog);
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
    }

    disconnectedCallback() {
        console.log("disconnected");
    }
}

defineCustomElement("consent-banner", ConsentBanner);
