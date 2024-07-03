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
        if (!code || code.length !== 5 || !code.match(/^[0-9]+$/)) {
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
            const code = `${new FormData(form).get("screensharing_code") ?? ""}`;
            if (this.validateInput(code)) {
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

customElements.define("screensharing-modal", ScreensharingModal);
customElements.define("screenshare-button", ScreenshareButton);
