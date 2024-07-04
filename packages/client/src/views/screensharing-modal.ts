import { defineCustomElement } from "../custom-elements";
import { param } from "../params";
import { lazyLoadScreensharing, startCall } from "../screensharing";
import clsInputs from "../styles/inputs.module.css";

export class ScreensharingModal extends HTMLElement {
    dialog!: HTMLDialogElement;
    input!: HTMLInputElement;
    errorList!: HTMLElement;

    showModal() {
        this.dialog.showModal();
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
        this.input.addEventListener("input", () => this.clearErrors());

        const form = this.querySelector("form")!;
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const code = new FormData(form).get("screensharing_code");
            if (typeof code === "string" && this.validateInput(code)) {
                startCall(code);
                this.dialog.close();
            }
        });

        this.querySelector("button[data-type=cancel]")?.addEventListener(
            "click",
            () => this.dialog.close(),
        );
    }
}

class ScreenshareButton extends HTMLElement {
    connectedCallback() {
        this.addEventListener("click", () =>
            lazyLoadScreensharing(() => {
                const dialog = document.querySelector(
                    "screensharing-modal",
                ) as HTMLDialogElement;

                dialog.showModal();
            }),
        );
    }
}

defineCustomElement("screensharing-modal", ScreensharingModal);
defineCustomElement("screenshare-button", ScreenshareButton);
