import {
    fetchOrRenewSession,
    SessionData,
    transformSessionToAuth,
} from "../../helpers/auth";
import { addSecondsFromNow } from "../../helpers/time";
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
    private activityCheckTimer?: number;
    private static readonly ACTIVITY_CHECK_INTERVAL_MS = 30 * 60 * 1000;

    private handleActivity = () => {
        if (!this.isEnabled) return;
        this.lastActivityAt = Date.now();
    };

    private isUserActive = () => this.lastActivityAt > 0;

    private resetActivity = () => {
        this.lastActivityAt = 0;
    };

    private onVisibilityChange = async () => {
        if (
            param("logoutWarning") !== false &&
            document.visibilityState === "visible"
        ) {
            this.updateDialogs(await fetchOrRenewSession("fetch"));
        }
    };

    private updateDialogs = (sessionData: SessionData | null) => {
        if (sessionData) {
            const { sessionExpireAtLocal, tokenExpireAtLocal } =
                transformSessionToAuth(sessionData);
            this.sessionDialog.sessionExpireAtLocal = sessionExpireAtLocal;
            this.tokenDialog.tokenExpireAtLocal = tokenExpireAtLocal;
        } else {
            this.sessionDialog.sessionExpireAtLocal = undefined;
            this.tokenDialog.tokenExpireAtLocal = undefined;
        }
    };

    private init = async () => {
        this.isEnabled = true;
        this.updateDialogs(await fetchOrRenewSession("fetch"));

        globalThis.clearInterval(this.activityCheckTimer);
        this.activityCheckTimer = globalThis.setInterval(async () => {
            if (this.isUserActive()) {
                this.updateDialogs(await fetchOrRenewSession("renew"));
                this.resetActivity();
            }
        }, LogoutWarning.ACTIVITY_CHECK_INTERVAL_MS);

        globalThis.loginDebug = {
            expireToken: (seconds: number) => {
                this.tokenDialog.tokenExpireAtLocal =
                    addSecondsFromNow(seconds);
            },
            expireSession: (seconds: number) => {
                this.sessionDialog.sessionExpireAtLocal =
                    addSecondsFromNow(seconds);
            },
        };
    };

    private handleParamsUpdated = (
        event: CustomEvent<CustomEvents["paramsupdated"]>,
    ) => {
        if (!event.detail.changedKeys.includes("logoutWarning")) return;

        if (event.detail.params.logoutWarning !== false) {
            this.init();
        } else {
            this.isEnabled = false;
            globalThis.clearInterval(this.activityCheckTimer);
            this.resetActivity();
        }
    };

    connectedCallback() {
        globalThis.addEventListener(
            "visibilitychange",
            this.onVisibilityChange,
        );
        globalThis.addEventListener("paramsupdated", this.handleParamsUpdated);
        globalThis.addEventListener("keydown", this.handleActivity);
        globalThis.addEventListener("click", this.handleActivity);
        globalThis.addEventListener("scroll", this.handleActivity, {
            passive: true,
        });
        globalThis.addEventListener("touchstart", this.handleActivity, {
            passive: true,
        });

        if (param("logoutWarning") !== false) {
            this.init();
        }

        this.sessionDialog = this.querySelector("session-dialog")!;
        this.tokenDialog = this.querySelector("token-dialog")!;

        this.tokenDialog.checkActivity = this.isUserActive;

        this.tokenDialog.addEventListener("renew", async () => {
            this.updateDialogs(await fetchOrRenewSession("renew"));
            this.resetActivity();
        });
    }

    disconnectedCallback() {
        globalThis.removeEventListener(
            "visibilitychange",
            this.onVisibilityChange,
        );
        globalThis.removeEventListener(
            "paramsupdated",
            this.handleParamsUpdated,
        );
        globalThis.removeEventListener("keydown", this.handleActivity);
        globalThis.removeEventListener("click", this.handleActivity);
        globalThis.removeEventListener("scroll", this.handleActivity);
        globalThis.removeEventListener("touchstart", this.handleActivity);
        globalThis.clearInterval(this.activityCheckTimer);
        globalThis.loginDebug = undefined as any;
    }
}

defineCustomElement("logout-warning", LogoutWarning);
