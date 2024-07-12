import { defineCustomElement } from "../custom-elements";
import { logout } from "../helpers/auth";
import { getSecondsRemaining } from "../helpers/time";
import { env } from "../params";

export class TokenDialog extends HTMLElement {
    tokenExpireAtLocal?: string;
    private interval?: number;

    private get secondsRemaining() {
        return this.tokenExpireAtLocal
            ? getSecondsRemaining(this.tokenExpireAtLocal)
            : Infinity;
    }

    connectedCallback() {
        const dialog = this.querySelector("dialog") as HTMLDialogElement;
        const form = dialog.querySelector("form") as HTMLFormElement;

        form.addEventListener("submit", (event: SubmitEvent) => {
            event.preventDefault();
            const action = new FormData(form, event.submitter).get("action");
            if (action === "renew") {
                this.dispatchEvent(new Event("renew"));
                dialog.close();
            } else {
                logout();
            }
        });

        this.interval = window.setInterval(() => {
            if (this.secondsRemaining < 0) {
                logout();
            } else if (this.secondsRemaining < 5 * 60) {
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
