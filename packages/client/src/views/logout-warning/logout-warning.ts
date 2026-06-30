import type { ClientParams } from "decorator-shared/params";
import { logoutWarningSelector } from "decorator-shared/views/logout-warning";
import {
    SessionData,
    fetchOrRenewSession,
    transformSessionToAuth,
} from "../../helpers/auth";
import { getRequiredElement } from "../../helpers/dom";
import { addSecondsFromNow } from "../../helpers/time";
import { onParamsUpdated } from "../../helpers/params-updated";
import { param } from "../../params";
import { defineCustomElement } from "../custom-elements";
import { SessionDialog } from "./session-dialog";
import { TokenDialog } from "./token-dialog";

class LogoutWarning extends HTMLElement {
    private tokenDialog!: TokenDialog;
    private sessionDialog!: SessionDialog;

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

    private unsubscribeParams?: () => void;

    private handleLogoutWarningParam = ({ logoutWarning }: ClientParams) => {
        if (logoutWarning) {
            this.init();
        }
    };

    connectedCallback() {
        window.addEventListener("visibilitychange", this.onVisibilityChange);

        this.sessionDialog = getRequiredElement<SessionDialog>(
            this,
            logoutWarningSelector.sessionDialog,
        );
        this.tokenDialog = getRequiredElement<TokenDialog>(
            this,
            logoutWarningSelector.tokenDialog,
        );
        this.tokenDialog.addEventListener("renew", async () =>
            this.updateDialogs(await fetchOrRenewSession("renew")),
        );
        this.unsubscribeParams = onParamsUpdated({
            keys: ["logoutWarning"],
            initial: true,
            update: this.handleLogoutWarningParam,
        });
    }

    disconnectedCallback() {
        window.removeEventListener("visibilitychange", this.onVisibilityChange);
        this.unsubscribeParams?.();
        window.loginDebug = undefined as any;
    }
}

defineCustomElement("logout-warning", LogoutWarning);
