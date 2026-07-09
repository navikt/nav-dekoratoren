import { logAnalyticsEvent } from "../../analytics/analytics";
import { logout } from "../../helpers/auth";
import { isDialogDefined } from "../../helpers/dialog-util";
import { getSecondsRemaining } from "../../helpers/time";
import { defineCustomElement } from "../custom-elements";

export class TokenDialog extends HTMLElement {
    private _tokenExpireAtLocal?: string;
    checkActivity?: () => boolean;
    private timer?: ReturnType<typeof globalThis.setTimeout>;
    private isAutoRenewing = false;
    private tick?: () => void;
    private static readonly NEAR_EXPIRY_THRESHOLD_SECONDS = 5 * 60;
    private static readonly FAR_CHECK_INTERVAL_MS = 60 * 1000;
    private static readonly NEAR_CHECK_INTERVAL_MS = 1000;

    get tokenExpireAtLocal() {
        return this._tokenExpireAtLocal;
    }

    set tokenExpireAtLocal(value: string | undefined) {
        this._tokenExpireAtLocal = value;

        if (
            !this._tokenExpireAtLocal ||
            (this.isAutoRenewing &&
                this.secondsRemaining >=
                    TokenDialog.NEAR_EXPIRY_THRESHOLD_SECONDS)
        ) {
            this.isAutoRenewing = false;
        }
    }

    private get secondsRemaining() {
        return this._tokenExpireAtLocal
            ? getSecondsRemaining(this._tokenExpireAtLocal)
            : Infinity;
    }

    notifyRenewComplete() {
        if (this.secondsRemaining < TokenDialog.NEAR_EXPIRY_THRESHOLD_SECONDS) {
            this.isAutoRenewing = false;
        }
    }

    checkNow() {
        globalThis.clearTimeout(this.timer);
        this.tick?.();
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
                logAnalyticsEvent("token dialog renew");
                this.dispatchEvent(new Event("renew"));
                dialog.close();
            } else {
                logAnalyticsEvent("token dialog logout");
                logout();
            }
        });

        const tick = () => {
            if (this.secondsRemaining < 0) {
                logout();
                return;
            } else if (
                this.secondsRemaining <
                TokenDialog.NEAR_EXPIRY_THRESHOLD_SECONDS
            ) {
                if (!this.isAutoRenewing && this.checkActivity?.()) {
                    this.isAutoRenewing = true;
                    this.dispatchEvent(new Event("renew"));
                } else if (!this.isAutoRenewing) {
                    if (!dialog.open) {
                        logAnalyticsEvent("token dialog shown");
                        dialog.showModal();
                    }
                }
            } else {
                this.isAutoRenewing = false;
                dialog.close();
            }

            const nextDelayMs =
                this.secondsRemaining <
                TokenDialog.NEAR_EXPIRY_THRESHOLD_SECONDS
                    ? TokenDialog.NEAR_CHECK_INTERVAL_MS
                    : TokenDialog.FAR_CHECK_INTERVAL_MS;
            this.timer = globalThis.setTimeout(tick, nextDelayMs);
        };

        this.tick = tick;

        this.timer = globalThis.setTimeout(
            tick,
            this.secondsRemaining < TokenDialog.NEAR_EXPIRY_THRESHOLD_SECONDS
                ? TokenDialog.NEAR_CHECK_INTERVAL_MS
                : TokenDialog.FAR_CHECK_INTERVAL_MS,
        );
    }

    disconnectedCallback() {
        globalThis.clearTimeout(this.timer);
        this.tick = undefined;
    }
}

defineCustomElement("token-dialog", TokenDialog);
