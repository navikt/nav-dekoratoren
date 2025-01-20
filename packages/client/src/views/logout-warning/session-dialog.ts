import { logAnalyticsEvent } from "../../analytics/analytics";
import { logout } from "../../helpers/auth";
import { isDialogDefined } from "../../helpers/dialog-util";
import { getSecondsRemaining } from "../../helpers/time";
import { defineCustomElement } from "../custom-elements";

export class SessionDialog extends HTMLElement {
    sessionExpireAtLocal?: string;
    private interval?: number;
    private silenceWarning = false;

    private get secondsRemaining() {
        return this.sessionExpireAtLocal
            ? getSecondsRemaining(this.sessionExpireAtLocal)
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
                logAnalyticsEvent("session dialog renew");
                this.silenceWarning = true;
                dialog.close();
            } else {
                logAnalyticsEvent("session dialog logout");
                logout();
            }
        });

        this.interval = window.setInterval(() => {
            if (this.secondsRemaining < 0) {
                logout();
            } else if (!this.silenceWarning && this.secondsRemaining < 5 * 60) {
                dialog.querySelector(".session-time-remaining")!.innerHTML =
                    Math.ceil(this.secondsRemaining / 60).toString();

                if (!dialog.open) {
                    dialog.showModal();
                    logAnalyticsEvent("session dialog shown");
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

defineCustomElement("session-dialog", SessionDialog);
