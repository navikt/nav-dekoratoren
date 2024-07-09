import clsModal from "decorator-client/src/styles/modal.module.css";
import { defineCustomElement } from "../custom-elements";
import {
    fetchRenew,
    fetchSession,
    transformSessionToAuth,
} from "../helpers/auth";
import { addSecondsFromNow, getSecondsRemaining } from "../helpers/time";
import { env, param } from "../params";

type Auth = {
    sessionExpireAtLocal: string;
    tokenExpireAtLocal: string;
};

class LogoutWarning extends HTMLElement {
    auth: Auth | null = null;
    silenceWarning: boolean = false;

    onVisibilityChange = () => {
        if (document.visibilityState === "visible") {
            this.updateAuthFromSession();
        }
    };

    updateAuthFromSession = async () => {
        const result = await fetchSession();
        if (!result?.session || !result?.tokens) {
            this.auth = null;
            return;
        }

        this.auth = transformSessionToAuth(result);
    };

    init() {
        Object.entries({
            token: async () => {
                const result = await fetchRenew();
                if (!result?.session && !result?.tokens) {
                    return;
                }
                this.auth = transformSessionToAuth(result);
            },
            session: () => {
                (
                    this.querySelector(
                        'dialog[data-type="session"]',
                    ) as HTMLDialogElement | null
                )?.close();
                this.silenceWarning = true;
            },
        }).forEach(([type, handler]) =>
            this.querySelector(
                `dialog[data-type="${type}"] form`,
            )?.addEventListener("submit", (event) => {
                event.preventDefault();
                const action = new FormData(event.target, event.submitter).get(
                    "action",
                );
                if (action === "renew") {
                    handler();
                } else {
                    window.location.href = env("LOGOUT_URL");
                }
            }),
        );
        window.addEventListener("visibilitychange", this.onVisibilityChange);
        this.updateAuthFromSession().then(() => {
            const interval = setInterval(() => {
                if (!this.auth) {
                    clearInterval(interval);
                } else {
                    const secondsToTokenExpiration = getSecondsRemaining(
                        this.auth.tokenExpireAtLocal,
                    );
                    const secondsToSessionExpiration = getSecondsRemaining(
                        this.auth.sessionExpireAtLocal,
                    );

                    if (
                        secondsToTokenExpiration < 0 ||
                        secondsToSessionExpiration < 0
                    ) {
                        window.location.href = `${window.__DECORATOR_DATA__.env.LOGOUT_URL}`;
                    }

                    const tokenDialog = this.querySelector(
                        'dialog[data-type="token"]',
                    ) as HTMLDialogElement;
                    const sessionDialog = this.querySelector(
                        'dialog[data-type="session"]',
                    ) as HTMLDialogElement;
                    const secondsToWarnBeforeExpiration = 5 * 60;
                    if (
                        secondsToTokenExpiration < secondsToWarnBeforeExpiration
                    ) {
                        tokenDialog.showModal();
                        return;
                    }

                    if (
                        secondsToSessionExpiration <
                            secondsToWarnBeforeExpiration &&
                        !this.silenceWarning
                    ) {
                        const minutesToSessionExpiration = Math.ceil(
                            secondsToSessionExpiration / 60,
                        );
                        const el = sessionDialog.querySelector(
                            `.${clsModal.modalTitle} > .session-time-remaining`,
                        )!;
                        el.innerHTML = minutesToSessionExpiration.toString();
                        sessionDialog.showModal();
                        return;
                    }

                    // Neither token nor session is about to expire, so close the dialogs
                    // that are open. This could happen if the user has multiple tabs open
                    // and has refreshet the token in one of them.
                    [sessionDialog, tokenDialog].forEach((dialog) => {
                        if (dialog.open) {
                            dialog.close();
                        }
                    });
                }
            }, 1000);
        });
        window.loginDebug = {
            expireToken: (seconds: number) => {
                if (this.auth) {
                    this.auth.tokenExpireAtLocal = addSecondsFromNow(seconds);
                } else {
                    console.error(
                        "No tokens found in auth object. Cannot fake token expiry.",
                    );
                }
            },
            expireSession: (seconds: number) => {
                if (this.auth) {
                    this.auth.sessionExpireAtLocal = addSecondsFromNow(seconds);
                } else {
                    console.error(
                        "No tokens found in auth object. Cannot fake session expiry.",
                    );
                }
            },
        };
    }

    onParamsUpdated = () => {
        if (param("logoutWarning")) {
            this.init();
        }
    };

    connectedCallback() {
        window.addEventListener("paramsupdated", this.onParamsUpdated);
        if (param("logoutWarning")) {
            this.init();
        }
    }

    disconnectedCallback() {
        window.removeEventListener("visibilitychange", this.onVisibilityChange);
        window.removeEventListener("paramsupdated", this.onParamsUpdated);
        window.loginDebug = undefined as any;
    }
}

defineCustomElement("logout-warning", LogoutWarning);
