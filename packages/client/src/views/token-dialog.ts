import { defineCustomElement } from "../custom-elements";
import { getSecondsRemaining } from "../helpers/time";

export class TokenDialog extends HTMLElement {
    interval?: number;

    set tokenExpireAtLocal(value: string | undefined) {
        this.setAttribute("token-expire-at-local", value || "");
    }

    get tokenExpireAtLocal() {
        return this.getAttribute("token-expire-at-local") || undefined;
    }

    get shouldShowDialog() {
        const secondsToWarnBeforeExpiration = 5 * 60;

        return (
            this.tokenExpireAtLocal &&
            getSecondsRemaining(this.tokenExpireAtLocal) <
                secondsToWarnBeforeExpiration
        );
    }

    connectedCallback() {
        const dialog = this.querySelector("dialog") as HTMLDialogElement;
        const form = dialog.querySelector("form") as HTMLFormElement;

        form.addEventListener("submit", (event: SubmitEvent) => {
            event.preventDefault();
            const action = new FormData(form, event.submitter).get("action");
            this.dispatchEvent(
                new Event(action === "renew" ? "renew" : "logout"),
            );
        });

        this.interval = window.setInterval(() => {
            if (this.shouldShowDialog) {
                dialog.showModal();
            } else {
                dialog.close();
            }
        }, 1000);
    }

    disconnectedCallback() {
        clearInterval(this.interval);
    }
}

defineCustomElement("token-dialog", TokenDialog);
