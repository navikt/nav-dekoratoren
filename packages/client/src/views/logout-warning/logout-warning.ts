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
    private activityCheckTimer?: ReturnType<typeof globalThis.setInterval>;
    private debugTimer?: ReturnType<typeof globalThis.setInterval>;
    private static readonly ACTIVITY_CHECK_INTERVAL_MS = 30 * 60 * 1000;
    private static readonly DEBUG_LOG_INTERVAL_MS = 10 * 60 * 1000;

    private handleActivity = (event: Event) => {
        if (!this.isEnabled) return;
        this.lastActivityAt = Date.now();
        log(`Aktivitet registrert: ${event.type}`);
    };

    private isUserActive = () => this.lastActivityAt > 0;

    private resetActivity = () => {
        this.lastActivityAt = 0;
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
        } else {
            log("updateDialogs: sessionData er null — nullstiller dialoger");
            this.sessionDialog.sessionExpireAtLocal = undefined;
            this.tokenDialog.tokenExpireAtLocal = undefined;
        }
    };

    private init = async () => {
        log("init() kalt — henter sesjonsstatus og starter aktivitetssjekk");
        this.isEnabled = true;
        this.updateDialogs(await fetchOrRenewSession("fetch"));

        globalThis.clearInterval(this.activityCheckTimer);
        this.activityCheckTimer = globalThis.setInterval(async () => {
            const aktiv = this.isUserActive();
            log(
                `Aktivitetssjekk (hvert ${LogoutWarning.ACTIVITY_CHECK_INTERVAL_MS / 60000} min): bruker ${aktiv ? "HAR vært aktiv → fornyer sesjon" : "har IKKE vært aktiv → ingen fornyelse"}`,
            );
            if (aktiv) {
                const sessionData = await fetchOrRenewSession("renew");
                if (sessionData) {
                    this.updateDialogs(sessionData);
                } else {
                    log("Aktivitetssjekk: fornyelse returnerte null");
                }
                this.resetActivity();
            }
        }, LogoutWarning.ACTIVITY_CHECK_INTERVAL_MS);

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
            log("logoutWarning=false — stopper aktivitetssjekk og nullstiller");
            this.isEnabled = false;
            globalThis.clearInterval(this.activityCheckTimer);
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
                `Statussjekkl: isEnabled=${this.isEnabled}, sistAktivitet=${this.lastActivityAt ? new Date(this.lastActivityAt).toLocaleTimeString("nb-NO") : "aldri"}`,
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
        globalThis.clearInterval(this.activityCheckTimer);
        globalThis.clearInterval(this.debugTimer);
        window.loginDebug = undefined as any;
    }
}

defineCustomElement("logout-warning", LogoutWarning);
