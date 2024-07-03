import { lazyLoadScreensharing, startCall } from "../screensharing";
import cls from "../styles/screensharing-modal.module.css";
import clsInputs from "../styles/inputs.module.css";
import { param } from "../params";
import { defineCustomElement } from "../custom-elements";

export class ScreensharingModal extends HTMLElement {
    dialog!: HTMLDialogElement;
    input!: HTMLInputElement;
    confirmButton!: HTMLButtonElement;
    cancelButton!: HTMLButtonElement;
    errorList!: HTMLUListElement;
    code: string = "";

    showModal() {
        this.dialog.showModal();
    }

    validateInput() {
        if (
            !this.code ||
            this.code.length !== 5 ||
            !this.code.match(/^[0-9]+$/)
        ) {
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

        this.dialog = this.querySelector("dialog") as HTMLDialogElement;
        this.input = this.querySelector(
            "input#screensharing_code",
        ) as HTMLInputElement;
        this.confirmButton = this.querySelector(
            `.${cls.confirmButton}`,
        ) as HTMLButtonElement;
        this.cancelButton = this.querySelector(
            `.${cls.cancelButton}`,
        ) as HTMLButtonElement;
        this.errorList = this.querySelector("ul") as HTMLUListElement;

        this.input.addEventListener("input", () => {
            this.clearErrors();
            this.code = this.input.value;
        });

        this.confirmButton.addEventListener("click", () => {
            if (this.validateInput()) {
                startCall(this.code);
                this.dialog.close();
            }
        });

        this.cancelButton.addEventListener("click", () => {
            this.dialog.close();
        });
    }
}

class ScreenshareButton extends HTMLElement {
    handleClick() {
        const dialog = document.querySelector(
            "screensharing-modal",
        ) as HTMLDialogElement;

        lazyLoadScreensharing(() => {
            dialog.showModal();
        });
    }

    connectedCallback() {
        this.addEventListener("click", this.handleClick);
    }

    disonnectedCallback() {
        this.removeEventListener("click", this.handleClick);
    }
}

defineCustomElement("screensharing-modal", ScreensharingModal);
defineCustomElement("screenshare-button", ScreenshareButton);
