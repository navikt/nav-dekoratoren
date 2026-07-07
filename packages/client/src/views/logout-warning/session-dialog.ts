import { logAnalyticsEvent } from "../../analytics/analytics";
import { logout } from "../../helpers/auth";
import { isDialogDefined } from "../../helpers/dialog-util";
import { getSecondsRemaining } from "../../helpers/time";
import { defineCustomElement } from "../custom-elements";

export class SessionDialog extends HTMLElement {
    sessionExpireAtLocal?: string;
    private timer?: ReturnType<typeof globalThis.setTimeout>;
    private silenceWarning = false;
    private static readonly NEAR_EXPIRY_THRESHOLD_SECONDS = 5 * 60;
    private static readonly FAR_CHECK_INTERVAL_MS = 60 * 1000;
    private static readonly NEAR_CHECK_INTERVAL_MS = 1000;

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

        const tick = () => {
            if (this.secondsRemaining < 0) {
                logout();
            } else if (
                !this.silenceWarning &&
                this.secondsRemaining <
                    SessionDialog.NEAR_EXPIRY_THRESHOLD_SECONDS
            ) {
                dialog.querySelector(".session-time-remaining")!.innerHTML =
                    Math.ceil(this.secondsRemaining / 60).toString();

                if (!dialog.open) {
                    dialog.showModal();
                    logAnalyticsEvent("session dialog shown");
                }
            } else {
                dialog.close();
            }

            const nextDelayMs =
                this.secondsRemaining <
                SessionDialog.NEAR_EXPIRY_THRESHOLD_SECONDS
                    ? SessionDialog.NEAR_CHECK_INTERVAL_MS
                    : SessionDialog.FAR_CHECK_INTERVAL_MS;
            this.timer = globalThis.setTimeout(tick, nextDelayMs);
        };

        this.timer = globalThis.setTimeout(
            tick,
            this.secondsRemaining < SessionDialog.NEAR_EXPIRY_THRESHOLD_SECONDS
                ? SessionDialog.NEAR_CHECK_INTERVAL_MS
                : SessionDialog.FAR_CHECK_INTERVAL_MS,
        );
    }

    disconnectedCallback() {
        globalThis.clearTimeout(this.timer);
    }
}

defineCustomElement("session-dialog", SessionDialog);
