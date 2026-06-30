import { logoutWarningSelector } from "decorator-shared/views/logout-warning";
import { logAnalyticsEvent } from "../../analytics/analytics";
import { logout } from "../../helpers/auth";
import { isDialogDefined } from "../../helpers/dialog-util";
import { getRequiredElement } from "../../helpers/dom";
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
        const dialog = getRequiredElement<HTMLDialogElement>(
            this,
            logoutWarningSelector.dialog,
        );
        const form = getRequiredElement<HTMLFormElement>(
            dialog,
            logoutWarningSelector.form,
        );

        if (!isDialogDefined(dialog)) {
            return;
        }

        form.addEventListener("submit", (event: SubmitEvent) => {
            event.preventDefault();
            const action = new FormData(form, event.submitter).get("action");
            if (action === "renew") {
                logAnalyticsEvent("token dialog renew");
                this.dispatchEvent(new Event("renew"));
                dialog.close();
            } else {
                logAnalyticsEvent("token dialog logout");
                logout();
            }
        });

        this.interval = window.setInterval(() => {
            if (this.secondsRemaining < 0) {
                logout();
            } else if (this.secondsRemaining < 5 * 60) {
                if (!dialog.open) {
                    logAnalyticsEvent("token dialog shown");
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
