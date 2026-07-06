import {
    fetchOrRenewSession,
    SessionData,
    transformSessionToAuth,
} from "../../helpers/auth";
import { param } from "../../params";
import { defineCustomElement } from "../custom-elements";
import { CustomEvents } from "../../events";
import { SessionDialog } from "./session-dialog";
import { TokenDialog } from "./token-dialog";

class LogoutWarning extends HTMLElement {
    private tokenDialog!: TokenDialog;
    private sessionDialog!: SessionDialog;
    private lastActivityAt = 0;
    private isEnabled = false;
    private renewalTimer?: ReturnType<typeof globalThis.setTimeout>;
    private inactivityTimer?: ReturnType<typeof globalThis.setTimeout>;
    private nextAutoRefreshInSeconds = 0;
    private static readonly INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

    private readonly handleActivity = () => {
        if (!this.isEnabled) return;
        const isFirstActivity = this.renewalTimer === undefined;
        this.lastActivityAt = Date.now();

        // Reset inaktivitetstimeren — aktivitet nullstilles automatisk etter 30 min uten input
        globalThis.clearTimeout(this.inactivityTimer);
        this.inactivityTimer = globalThis.setTimeout(() => {
            this.lastActivityAt = 0;
            this.inactivityTimer = undefined;
        }, LogoutWarning.INACTIVITY_TIMEOUT_MS);

        if (isFirstActivity) {
            this.scheduleRenewal(Math.max(0, this.nextAutoRefreshInSeconds));
        }
    };

    private readonly isUserActive = () => this.lastActivityAt > 0;

    private readonly resetActivity = () => {
        this.lastActivityAt = 0;
        globalThis.clearTimeout(this.renewalTimer);
        this.renewalTimer = undefined;
        globalThis.clearTimeout(this.inactivityTimer);
        this.inactivityTimer = undefined;
    };

    private readonly scheduleRenewal = (inSeconds: number) => {
        globalThis.clearTimeout(this.renewalTimer);
        this.renewalTimer = globalThis.setTimeout(async () => {
            this.renewalTimer = undefined;
            if (!this.isUserActive()) {
                return;
            }
            const sessionData = await fetchOrRenewSession("renew");
            this.resetActivity();
            if (sessionData) {
                this.updateDialogs(sessionData);
            }
        }, inSeconds * 1000);
    };

    private onVisibilityChange = async () => {
        if (param("logoutWarning") && document.visibilityState === "visible") {
            this.updateDialogs(await fetchOrRenewSession("fetch"));
        }
    };

    private updateDialogs = (sessionData: SessionData | null) => {
        if (sessionData) {
            const { sessionExpireAtLocal, tokenExpireAtLocal } =
                transformSessionToAuth(sessionData);
            this.sessionDialog.sessionExpireAtLocal = sessionExpireAtLocal;
            this.tokenDialog.tokenExpireAtLocal = tokenExpireAtLocal;
            this.nextAutoRefreshInSeconds =
                sessionData.tokens.next_auto_refresh_in_seconds;

            // Hvis bruker var aktiv før vi fikk session-data (f.eks. klikket under init-henting),
            // planlegg fornyelse nå
            if (this.isUserActive() && this.renewalTimer === undefined) {
                this.scheduleRenewal(
                    Math.max(0, this.nextAutoRefreshInSeconds),
                );
            }
        } else {
            this.sessionDialog.sessionExpireAtLocal = undefined;
            this.tokenDialog.tokenExpireAtLocal = undefined;
        }
    };

    private init = async () => {
        this.isEnabled = true;
        this.updateDialogs(await fetchOrRenewSession("fetch"));
    };

    private handleParamsUpdated = (
        event: CustomEvent<CustomEvents["paramsupdated"]>,
    ) => {
        if (!event.detail.changedKeys.includes("logoutWarning")) return;

        const val = event.detail.params.logoutWarning;

        if (val) {
            this.init();
        } else {
            this.isEnabled = false;
            this.resetActivity();
            this.updateDialogs(null);
        }
    };

    connectedCallback() {
        window.addEventListener("visibilitychange", this.onVisibilityChange);
        window.addEventListener("paramsupdated", this.handleParamsUpdated);
        window.addEventListener("keydown", this.handleActivity);
        window.addEventListener("click", this.handleActivity);
        window.addEventListener("scroll", this.handleActivity, {
            passive: true,
        });
        window.addEventListener("touchstart", this.handleActivity, {
            passive: true,
        });

        this.sessionDialog = this.querySelector("session-dialog")!;
        this.tokenDialog = this.querySelector("token-dialog")!;

        this.tokenDialog.checkActivity = this.isUserActive;

        this.tokenDialog.addEventListener("renew", async () => {
            const sessionData = await fetchOrRenewSession("renew");
            if (sessionData) {
                this.updateDialogs(sessionData);
            } else {
                // Renewal feilet — reset isAutoRenewing så dialogen kan vises
                this.tokenDialog.notifyRenewComplete();
            }
            this.resetActivity();
        });

        if (param("logoutWarning") !== false) {
            this.init();
        }
    }

    disconnectedCallback() {
        window.removeEventListener("visibilitychange", this.onVisibilityChange);
        window.removeEventListener("paramsupdated", this.handleParamsUpdated);
        window.removeEventListener("keydown", this.handleActivity);
        window.removeEventListener("click", this.handleActivity);
        window.removeEventListener("scroll", this.handleActivity);
        window.removeEventListener("touchstart", this.handleActivity);
        globalThis.clearTimeout(this.renewalTimer);
        globalThis.clearTimeout(this.inactivityTimer);
    }
}

defineCustomElement("logout-warning", LogoutWarning);
