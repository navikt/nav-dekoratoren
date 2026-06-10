import { fixture } from "@open-wc/testing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SessionData } from "../../helpers/auth";
import "./logout-warning";
import { TokenDialog } from "./token-dialog";

vi.mock("../../helpers/auth", () => ({
    fetchOrRenewSession: vi.fn().mockResolvedValue(null),
    transformSessionToAuth: vi.fn(() => ({
        sessionExpireAtLocal: new Date(Date.now() + 3600_000).toISOString(),
        tokenExpireAtLocal: new Date(Date.now() + 3600_000).toISOString(),
    })),
    logout: vi.fn(),
    addSecondsFromNow: vi.fn(),
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
        window.__DECORATOR_DATA__ = { params: {}, env: {}, texts: {} } as any;
        el = await fixture(LOGOUT_WARNING_HTML);
        tokenDialog = el.querySelector("token-dialog")! as TokenDialog;
        (el.querySelector("dialog") as any).showModal = vi.fn();
        (el.querySelector("dialog") as any).close = vi.fn();
        vi.useFakeTimers();

        // Trigger init() slik at isEnabled = true og intervallet starter
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

    it("checkActivity er koblet til tokenDialog", () => {
        expect(typeof tokenDialog.checkActivity).toBe("function");
    });

    it("checkActivity returnerer false når ingen brukeraktivitet er registrert", () => {
        expect(tokenDialog.checkActivity!()).toBe(false);
    });

    it("checkActivity returnerer true etter keydown-event", () => {
        window.dispatchEvent(new KeyboardEvent("keydown"));
        expect(tokenDialog.checkActivity!()).toBe(true);
    });

    it("checkActivity returnerer true etter click-event", () => {
        window.dispatchEvent(new MouseEvent("click"));
        expect(tokenDialog.checkActivity!()).toBe(true);
    });

    it("checkActivity returnerer true etter scroll-event", () => {
        window.dispatchEvent(new Event("scroll"));
        expect(tokenDialog.checkActivity!()).toBe(true);
    });

    it("checkActivity returnerer true etter touchstart-event", () => {
        window.dispatchEvent(new TouchEvent("touchstart"));
        expect(tokenDialog.checkActivity!()).toBe(true);
    });

    it("aktivitet resettes etter token renewal via updateDialogs", async () => {
        const { fetchOrRenewSession } = await import("../../helpers/auth");
        const mockSessionData = {} as SessionData;
        vi.mocked(fetchOrRenewSession).mockResolvedValue(mockSessionData);

        window.dispatchEvent(new KeyboardEvent("keydown"));
        expect(tokenDialog.checkActivity!()).toBe(true);

        // Dispatch "renew" fra tokenDialog (simulerer at parent kaller updateDialogs)
        tokenDialog.dispatchEvent(new Event("renew"));

        await Promise.resolve();

        expect(tokenDialog.checkActivity!()).toBe(false);
    });

    it("proaktiv renewal kalles ikke når bruker er inaktiv etter 30 minutter", async () => {
        const { fetchOrRenewSession } = await import("../../helpers/auth");
        vi.mocked(fetchOrRenewSession).mockResolvedValue({} as SessionData);

        // Ingen aktivitet — hopp frem 30 minutter
        vi.advanceTimersByTime(30 * 60 * 1000);
        await Promise.resolve();

        expect(vi.mocked(fetchOrRenewSession)).not.toHaveBeenCalledWith(
            "renew",
        );
    });

    it("proaktiv renewal kalles etter 30 minutter når bruker har vært aktiv", async () => {
        const { fetchOrRenewSession } = await import("../../helpers/auth");
        vi.mocked(fetchOrRenewSession).mockResolvedValue({} as SessionData);

        // Bruker er aktiv
        window.dispatchEvent(new KeyboardEvent("keydown"));
        expect(tokenDialog.checkActivity!()).toBe(true);

        // Hopp frem 30 minutter — intervallet sjekker aktivitet og fornyer
        vi.advanceTimersByTime(30 * 60 * 1000);
        await Promise.resolve();

        expect(vi.mocked(fetchOrRenewSession)).toHaveBeenCalledWith("renew");
    });

    it("aktivitet resettes etter intervall-renewal", async () => {
        const { fetchOrRenewSession } = await import("../../helpers/auth");
        vi.mocked(fetchOrRenewSession).mockResolvedValue({} as SessionData);

        window.dispatchEvent(new MouseEvent("click"));
        expect(tokenDialog.checkActivity!()).toBe(true);

        vi.advanceTimersByTime(30 * 60 * 1000);
        await Promise.resolve();

        // Etter renewal skal aktivitet være nullstilt
        expect(tokenDialog.checkActivity!()).toBe(false);
    });
});
