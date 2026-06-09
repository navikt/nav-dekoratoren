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

    private handleActivity = () => {
        this.lastActivityAt = Date.now();
    };

    private isUserActive = () => this.lastActivityAt > 0;

    private resetActivity = () => {
        this.lastActivityAt = 0;
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
        } else {
            this.sessionDialog.sessionExpireAtLocal = undefined;
            this.tokenDialog.tokenExpireAtLocal = undefined;
        }
        this.resetActivity();
    };

    private init = async () => {
        this.updateDialogs(await fetchOrRenewSession("fetch"));

        window.loginDebug = {
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
        if (
            event.detail.changedKeys.includes("logoutWarning") &&
            event.detail.params.logoutWarning
        ) {
            this.init();
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

        if (param("logoutWarning")) {
            this.init();
        }

        this.sessionDialog = this.querySelector("session-dialog")!;
        this.tokenDialog = this.querySelector("token-dialog")!;

        this.tokenDialog.checkActivity = this.isUserActive;
        this.tokenDialog.addEventListener("renew", async () =>
            this.updateDialogs(await fetchOrRenewSession("renew")),
        );
    }

    disconnectedCallback() {
        window.removeEventListener("visibilitychange", this.onVisibilityChange);
        window.removeEventListener("paramsupdated", this.handleParamsUpdated);
        window.removeEventListener("keydown", this.handleActivity);
        window.removeEventListener("click", this.handleActivity);
        window.removeEventListener("scroll", this.handleActivity);
        window.removeEventListener("touchstart", this.handleActivity);
        window.loginDebug = undefined as any;
    }
}

defineCustomElement("logout-warning", LogoutWarning);
