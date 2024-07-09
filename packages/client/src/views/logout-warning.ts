import { defineCustomElement } from "../custom-elements";
import { fetchSession, transformSessionToAuth } from "../helpers/auth";
import { param } from "../params";
import { TokenDialog } from "./token-dialog";

type Auth = {
    sessionExpireAtLocal: string;
    tokenExpireAtLocal: string;
};

class LogoutWarning extends HTMLElement {
    auth: Auth | null = null;
    silenceWarning: boolean = false;
    tokenDialog!: TokenDialog;

    onVisibilityChange = () => {
        if (param("logoutWarning") && document.visibilityState === "visible") {
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
        return this.auth;
    };

    handleParamsUpdated = (event: CustomEvent) => {
        if (event.detail.params.logoutWarning) {
            this.updateAuthFromSession().then((auth) => {
                this.tokenDialog.tokenExpireAtLocal = auth?.tokenExpireAtLocal;
            });
        }
    };

    connectedCallback() {
        window.addEventListener("visibilitychange", this.onVisibilityChange);
        window.addEventListener("paramsupdated", this.handleParamsUpdated);
        this.tokenDialog = this.querySelector("token-dialog")!;
    }

    disconnectedCallback() {
        window.removeEventListener("visibilitychange", this.onVisibilityChange);
        window.removeEventListener("paramsupdated", this.handleParamsUpdated);
        window.loginDebug = undefined as any;
    }
}

defineCustomElement("logout-warning", LogoutWarning);
