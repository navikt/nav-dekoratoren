import { fixture } from "@open-wc/testing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchOrRenewSession, SessionData } from "../../helpers/auth";
import "./logout-warning";
import { TokenDialog } from "./token-dialog";

const makeSessionData = (nextAutoRefreshInSeconds: number): SessionData => ({
    session: {
        created_at: "",
        ends_at: "",
        timeout_at: "",
        ends_in_seconds: 7200,
        active: true,
        timeout_in_seconds: 7200,
    },
    tokens: {
        expire_at: "",
        refreshed_at: "",
        expire_in_seconds: 3600,
        next_auto_refresh_in_seconds: nextAutoRefreshInSeconds,
        refresh_cooldown: false,
        refresh_cooldown_seconds: 0,
    },
});

vi.mock("../../helpers/auth", () => ({
    fetchOrRenewSession: vi.fn(),
    transformSessionToAuth: vi.fn(() => ({
        sessionExpireAtLocal: new Date(Date.now() + 3600_000).toISOString(),
        tokenExpireAtLocal: new Date(Date.now() + 3600_000).toISOString(),
    })),
    logout: vi.fn(),
}));
vi.mock("../../analytics/analytics", () => ({ logAnalyticsEvent: vi.fn() }));
vi.mock("../../helpers/dialog-util", () => ({
    isDialogDefined: vi.fn(() => true),
}));
vi.mock("../../params", () => ({
    param: vi.fn(() => false), // logoutWarning = false → skip init()
}));

const LOGOUT_WARNING_HTML = `
    <logout-warning>
        <token-dialog>
            <dialog>
                <form>
                    <button name="action" value="renew">Forny</button>
                    <button name="action" value="logout">Logg ut</button>
                </form>
            </dialog>
        </token-dialog>
        <session-dialog>
            <dialog>
                <form>
                    <div class="session-time-remaining"></div>
                    <button name="action" value="renew">OK</button>
                    <button name="action" value="logout">Logg ut</button>
                </form>
            </dialog>
        </session-dialog>
    </logout-warning>
`;

describe("LogoutWarning — aktivitetssporing", () => {
    let el: HTMLElement;
    let tokenDialog: TokenDialog;

    beforeEach(async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        window.__DECORATOR_DATA__ = { params: {}, env: {}, texts: {} } as any;

        // next_auto_refresh_in_seconds = 3300 (55 min) — standard produksjonsverdi
        vi.mocked(fetchOrRenewSession).mockResolvedValue(makeSessionData(3300));

        el = await fixture(LOGOUT_WARNING_HTML);
        tokenDialog = el.querySelector("token-dialog")! as TokenDialog;
        (el.querySelector("dialog") as any).showModal = vi.fn();
        (el.querySelector("dialog") as any).close = vi.fn();

        window.dispatchEvent(
            new CustomEvent("paramsupdated", {
                detail: {
                    changedKeys: ["logoutWarning"],
                    params: { logoutWarning: true },
                },
            }),
        );
        await Promise.resolve();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it("checkActivity returnerer false når ingen brukeraktivitet er registrert", () => {
        expect(tokenDialog.checkActivity!()).toBe(false);
    });

    it.each(["keydown", "click", "scroll", "touchstart"])(
        "checkActivity returnerer true etter %s-event",
        (eventType) => {
            window.dispatchEvent(new Event(eventType));
            expect(tokenDialog.checkActivity!()).toBe(true);
        },
    );

    it("aktivitet resettes etter token renewal via updateDialogs", async () => {
        window.dispatchEvent(new KeyboardEvent("keydown"));
        expect(tokenDialog.checkActivity!()).toBe(true);

        tokenDialog.dispatchEvent(new Event("renew"));

        await Promise.resolve();

        expect(tokenDialog.checkActivity!()).toBe(false);
    });

    it("proaktiv renewal kalles ikke når bruker er inaktiv", async () => {
        // Ingen aktivitet → ingen renewal-timer planlagt → ingen renewal
        vi.advanceTimersByTime(3300 * 1000);
        await Promise.resolve();

        expect(vi.mocked(fetchOrRenewSession)).not.toHaveBeenCalledWith(
            "renew",
        );
    });

    it("proaktiv renewal planlegges, kalles og nullstiller aktivitet etter next_auto_refresh_in_seconds", async () => {
        vi.mocked(fetchOrRenewSession).mockResolvedValue(makeSessionData(600));
        window.dispatchEvent(
            new CustomEvent("paramsupdated", {
                detail: {
                    changedKeys: ["logoutWarning"],
                    params: { logoutWarning: true },
                },
            }),
        );
        await Promise.resolve();

        window.dispatchEvent(new KeyboardEvent("keydown"));
        expect(tokenDialog.checkActivity!()).toBe(true);

        vi.advanceTimersByTime(600 * 1000);
        await Promise.resolve();

        expect(vi.mocked(fetchOrRenewSession)).toHaveBeenCalledWith("renew");
        expect(tokenDialog.checkActivity!()).toBe(false);
    });

    it("aktivitet nullstilles automatisk etter 30 min uten input", async () => {
        window.dispatchEvent(new KeyboardEvent("keydown"));
        expect(tokenDialog.checkActivity!()).toBe(true);

        vi.advanceTimersByTime(30 * 60 * 1000);

        expect(tokenDialog.checkActivity!()).toBe(false);
    });

    it("ny aktivitet utsetter fornyelsen til siste aktivitet + next_auto_refresh_in_seconds, ikke bare første i syklusen", async () => {
        window.dispatchEvent(new KeyboardEvent("keydown"));

        vi.advanceTimersByTime(50 * 60 * 1000);
        window.dispatchEvent(new KeyboardEvent("keydown"));

        vi.advanceTimersByTime(5 * 60 * 1000);
        await Promise.resolve();
        expect(vi.mocked(fetchOrRenewSession)).not.toHaveBeenCalledWith(
            "renew",
        );

        vi.advanceTimersByTime(50 * 60 * 1000);
        await Promise.resolve();
        expect(vi.mocked(fetchOrRenewSession)).toHaveBeenCalledWith("renew");
    });

    it("throttler reset av inaktivitetstimeren ved mange raske aktivitetshendelser (f.eks. touch-scroll på 60-120 events/sek)", () => {
        const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
        const callsBefore = setTimeoutSpy.mock.calls.length;

        // Simulerer en rask serie scroll-events innenfor samme throttle-vindu
        for (let i = 0; i < 50; i++) {
            window.dispatchEvent(new Event("scroll"));
        }

        const inactivityTimerCalls = setTimeoutSpy.mock.calls
            .slice(callsBefore)
            .filter(([, delay]) => delay === 30 * 60 * 1000);
        expect(inactivityTimerCalls).toHaveLength(1);

        // Etter at throttle-vinduet (1s) har gått, skal neste aktivitet planlegge en ny timer
        vi.advanceTimersByTime(1000);
        window.dispatchEvent(new Event("scroll"));

        const inactivityTimerCallsAfter = setTimeoutSpy.mock.calls
            .slice(callsBefore)
            .filter(([, delay]) => delay === 30 * 60 * 1000);
        expect(inactivityTimerCallsAfter).toHaveLength(2);
    });

    it("proaktiv renewal klemmes til minimumsintervall når next_auto_refresh_in_seconds er 0 eller negativ (unngår renewal-storm ved f.eks. scroll)", async () => {
        vi.mocked(fetchOrRenewSession).mockResolvedValue(makeSessionData(-1));
        window.dispatchEvent(
            new CustomEvent("paramsupdated", {
                detail: {
                    changedKeys: ["logoutWarning"],
                    params: { logoutWarning: true },
                },
            }),
        );
        await Promise.resolve();

        window.dispatchEvent(new KeyboardEvent("keydown"));

        for (let i = 0; i < 50; i++) {
            window.dispatchEvent(new Event("scroll"));
        }

        vi.advanceTimersByTime(100);
        await Promise.resolve();

        expect(vi.mocked(fetchOrRenewSession)).not.toHaveBeenCalledWith(
            "renew",
        );

        vi.advanceTimersByTime(60 * 1000);
        await Promise.resolve();

        expect(vi.mocked(fetchOrRenewSession)).toHaveBeenCalledWith("renew");
        const renewCalls = vi
            .mocked(fetchOrRenewSession)
            .mock.calls.filter(([action]) => action === "renew");
        expect(renewCalls).toHaveLength(1);
    });

    it("planlagt renewal gjennomføres selv om aktivitet er eldre enn inaktivitetsgrensen (token skal alltid fornyes ~60 min etter siste aktivitet)", async () => {
        window.dispatchEvent(new KeyboardEvent("keydown"));

        vi.advanceTimersByTime(30 * 60 * 1000 + 1000);
        vi.advanceTimersByTime(3300 * 1000 - (30 * 60 * 1000 + 1000));
        await Promise.resolve();

        expect(vi.mocked(fetchOrRenewSession)).toHaveBeenCalledWith("renew");
    });
});
