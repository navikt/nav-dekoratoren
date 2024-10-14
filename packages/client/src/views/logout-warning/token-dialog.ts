import { logAmplitudeEvent } from "../../analytics/amplitude";
import { logout } from "../../helpers/auth";
import { isDialogDefined } from "../../helpers/dialog-util";
import { getSecondsRemaining } from "../../helpers/time";
import { defineCustomElement } from "../custom-elements";

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

        if (!isDialogDefined(dialog)) {
            return;
        }

        form.addEventListener("submit", (event: SubmitEvent) => {
            event.preventDefault();
            const action = new FormData(form, event.submitter).get("action");
            if (action === "renew") {
                logAmplitudeEvent("token dialog renew");
                this.dispatchEvent(new Event("renew"));
                dialog.close();
            } else {
                logAmplitudeEvent("token dialog logout");
                logout();
            }
        });

        this.interval = window.setInterval(() => {
            if (this.secondsRemaining < 0) {
                logout();
            } else if (this.secondsRemaining < 5 * 60) {
                if (!dialog.open) {
                    logAmplitudeEvent("token dialog shown");
                    dialog.showModal();
                }
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
