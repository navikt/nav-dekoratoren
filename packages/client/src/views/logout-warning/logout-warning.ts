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

const log = (...args: unknown[]) =>
    console.log(
        `[LogoutWarning ${new Date().toLocaleTimeString("nb-NO")}]`,
        ...args,
    );

class LogoutWarning extends HTMLElement {
    private tokenDialog!: TokenDialog;
    private sessionDialog!: SessionDialog;
    private lastActivityAt = 0;
    private isEnabled = false;
    private renewalTimer?: ReturnType<typeof globalThis.setTimeout>;
    private inactivityTimer?: ReturnType<typeof globalThis.setTimeout>;
    private debugTimer?: ReturnType<typeof globalThis.setInterval>;
    private nextAutoRefreshInSeconds = 0;
    private static readonly DEBUG_LOG_INTERVAL_MS = 10 * 60 * 1000;
    private static readonly INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

    private handleActivity = (event: Event) => {
        if (!this.isEnabled) return;
        const isFirstActivity = this.renewalTimer === undefined;
        this.lastActivityAt = Date.now();
        log(`Aktivitet registrert: ${event.type}`);

        // Reset inaktivitetstimeren — aktivitet nullstilles automatisk etter 30 min uten input
        globalThis.clearTimeout(this.inactivityTimer);
        this.inactivityTimer = globalThis.setTimeout(() => {
            log("Inaktivitet: aktivitet nullstilles etter 30 min uten input");
            this.lastActivityAt = 0;
            this.inactivityTimer = undefined;
        }, LogoutWarning.INACTIVITY_TIMEOUT_MS);

        if (isFirstActivity) {
            this.scheduleRenewal(Math.max(0, this.nextAutoRefreshInSeconds));
        }
    };

    private isUserActive = () => this.lastActivityAt > 0;

    private resetActivity = () => {
        this.lastActivityAt = 0;
        globalThis.clearTimeout(this.renewalTimer);
        this.renewalTimer = undefined;
        globalThis.clearTimeout(this.inactivityTimer);
        this.inactivityTimer = undefined;
    };

    private scheduleRenewal = (inSeconds: number) => {
        globalThis.clearTimeout(this.renewalTimer);
        log(`Planlegger token-fornyelse om ${Math.round(inSeconds / 60)} min`);
        this.renewalTimer = globalThis.setTimeout(async () => {
            this.renewalTimer = undefined;
            if (!this.isUserActive()) {
                log("Planlagt fornyelse: bruker ikke aktiv → ingen fornyelse");
                return;
            }
            log("Planlagt fornyelse: bruker aktiv → fornyer sesjon");
            const sessionData = await fetchOrRenewSession("renew");
            this.resetActivity();
            if (sessionData) {
                this.updateDialogs(sessionData);
            } else {
                log("Planlagt fornyelse returnerte null");
            }
        }, inSeconds * 1000);
    };

    private onVisibilityChange = async () => {
        log(`visibilitychange: ${document.visibilityState}`);
        if (
            param("logoutWarning") !== false &&
            document.visibilityState === "visible"
        ) {
            log("Side synlig igjen — henter sesjonsstatus");
            this.updateDialogs(await fetchOrRenewSession("fetch"));
        }
    };

    private updateDialogs = (sessionData: SessionData | null) => {
        if (sessionData) {
            const { sessionExpireAtLocal, tokenExpireAtLocal } =
                transformSessionToAuth(sessionData);
            log(
                `updateDialogs: sesjon utløper ${sessionExpireAtLocal}, token utløper ${tokenExpireAtLocal}`,
            );
            this.sessionDialog.sessionExpireAtLocal = sessionExpireAtLocal;
            this.tokenDialog.tokenExpireAtLocal = tokenExpireAtLocal;
            this.nextAutoRefreshInSeconds =
                sessionData.tokens.next_auto_refresh_in_seconds;
            // Hvis bruker var aktiv før vi fikk session-data (f.eks. klikket under init-henting),
            // planlegg fornyelse nå
            if (this.isUserActive() && this.renewalTimer === undefined) {
                this.scheduleRenewal(this.nextAutoRefreshInSeconds);
            }
        } else {
            log("updateDialogs: sessionData er null — nullstiller dialoger");
            this.sessionDialog.sessionExpireAtLocal = undefined;
            this.tokenDialog.tokenExpireAtLocal = undefined;
        }
    };

    private init = async () => {
        log(
            "init() kalt — henter sesjonsstatus og planlegger aktivitetsbasert fornyelse",
        );
        this.isEnabled = true;
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
        if (!event.detail.changedKeys.includes("logoutWarning")) return;

        const val = event.detail.params.logoutWarning;
        log(`paramsupdated: logoutWarning endret til ${val}`);

        if (val !== false) {
            this.init();
        } else {
            log(
                "logoutWarning=false — stopper planlagt fornyelse og nullstiller",
            );
            this.isEnabled = false;
            this.resetActivity();
            this.updateDialogs(null);
        }
    };

    connectedCallback() {
        log("connectedCallback — kobler til event-lyttere");
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
            log("Token-fornyelse startet (renew-event fra TokenDialog)");
            const sessionData = await fetchOrRenewSession("renew");
            if (sessionData) {
                log("Token-fornyelse vellykket");
                this.updateDialogs(sessionData);
            } else {
                log("Token-fornyelse feilet — resetter isAutoRenewing");
                // Renewal feilet — reset isAutoRenewing så dialogen kan vises
                this.tokenDialog.notifyRenewComplete();
            }
            this.resetActivity();
        });

        this.debugTimer = globalThis.setInterval(() => {
            log(
                `Statussjekk: isEnabled=${this.isEnabled}, sistAktivitet=${this.lastActivityAt ? new Date(this.lastActivityAt).toLocaleTimeString("nb-NO") : "aldri"}, fornyelse=${this.renewalTimer ? "planlagt" : "ikke planlagt"}`,
            );
        }, LogoutWarning.DEBUG_LOG_INTERVAL_MS);

        if (param("logoutWarning") !== false) {
            log(`logoutWarning=${param("logoutWarning")} — kaller init()`);
            this.init();
        } else {
            log("logoutWarning=false — init() hoppes over");
        }
    }

    disconnectedCallback() {
        log("disconnectedCallback — fjerner event-lyttere");
        window.removeEventListener("visibilitychange", this.onVisibilityChange);
        window.removeEventListener("paramsupdated", this.handleParamsUpdated);
        window.removeEventListener("keydown", this.handleActivity);
        window.removeEventListener("click", this.handleActivity);
        window.removeEventListener("scroll", this.handleActivity);
        window.removeEventListener("touchstart", this.handleActivity);
        globalThis.clearTimeout(this.renewalTimer);
        globalThis.clearTimeout(this.inactivityTimer);
        globalThis.clearInterval(this.debugTimer);
        window.loginDebug = undefined as any;
    }
}

defineCustomElement("logout-warning", LogoutWarning);
