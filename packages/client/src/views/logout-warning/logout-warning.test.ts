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
    });

    afterEach(() => {
        vi.useRealTimers();
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
        const { fetchOrRenewSession, transformSessionToAuth } =
            await import("../../helpers/auth");
        const mockSessionData = {} as SessionData;
        vi.mocked(fetchOrRenewSession).mockResolvedValue(mockSessionData);

        window.dispatchEvent(new KeyboardEvent("keydown"));
        expect(tokenDialog.checkActivity!()).toBe(true);

        // Dispatch "renew" fra tokenDialog (simulerer at parent kaller updateDialogs)
        tokenDialog.dispatchEvent(new Event("renew"));

        // Vent på async updateDialogs
        await vi.runAllTimersAsync();

        expect(tokenDialog.checkActivity!()).toBe(false);
    });
});
