import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { addSecondsFromNow } from "../../helpers/time";
import "./token-dialog";
import { TokenDialog } from "./token-dialog";

vi.mock("../../analytics/analytics", () => ({ logAnalyticsEvent: vi.fn() }));
vi.mock("../../helpers/auth", () => ({ logout: vi.fn() }));
vi.mock("../../helpers/dialog-util", () => ({
    isDialogDefined: vi.fn(() => true),
}));

const TOKEN_DIALOG_HTML = `
    <token-dialog>
        <dialog>
            <form>
                <button name="action" value="renew">Forny</button>
                <button name="action" value="logout">Logg ut</button>
            </form>
        </dialog>
    </token-dialog>
`;

describe("TokenDialog — aktivitetsbasert auto-renew", () => {
    let tokenDialog: TokenDialog;
    let dialog: HTMLDialogElement;
    let container: HTMLDivElement;
    let tick: () => void;

    beforeEach(() => {
        vi.spyOn(window, "setInterval").mockImplementation((fn: any): any => {
            tick = fn;
            return 42;
        });
        vi.spyOn(window, "clearInterval").mockImplementation(() => {});

        container = document.createElement("div");
        container.innerHTML = TOKEN_DIALOG_HTML;
        document.body.appendChild(container);

        tokenDialog = container.querySelector("token-dialog") as TokenDialog;
        dialog = container.querySelector("dialog")!;
        dialog.showModal = vi.fn();
        dialog.close = vi.fn();
    });

    afterEach(() => {
        document.body.removeChild(container);
        vi.restoreAllMocks();
    });

    it("viser dialog når token utløper og bruker er inaktiv", () => {
        tokenDialog.tokenExpireAtLocal = addSecondsFromNow(250); // < 5 min
        tokenDialog.checkActivity = () => false;

        tick();

        expect(dialog.showModal).toHaveBeenCalledOnce();
    });

    it("dispatcher 'renew' silent når token utløper og bruker er aktiv", () => {
        tokenDialog.tokenExpireAtLocal = addSecondsFromNow(250); // < 5 min
        tokenDialog.checkActivity = () => true;

        const renewSpy = vi.fn();
        tokenDialog.addEventListener("renew", renewSpy);

        tick();

        expect(renewSpy).toHaveBeenCalledOnce();
        expect(dialog.showModal).not.toHaveBeenCalled();
    });

    it("dispatcher renew bare én gang selv om timer tikker flere ganger (isAutoRenewing-guard)", () => {
        tokenDialog.tokenExpireAtLocal = addSecondsFromNow(250);
        tokenDialog.checkActivity = () => true;

        const renewSpy = vi.fn();
        tokenDialog.addEventListener("renew", renewSpy);

        tick();
        tick();
        tick();

        expect(renewSpy).toHaveBeenCalledOnce();
    });

    it("viser dialog (ikke auto-renew) når checkActivity ikke er satt", () => {
        tokenDialog.tokenExpireAtLocal = addSecondsFromNow(250);
        tokenDialog.checkActivity = undefined;

        const renewSpy = vi.fn();
        tokenDialog.addEventListener("renew", renewSpy);

        tick();

        expect(renewSpy).not.toHaveBeenCalled();
        expect(dialog.showModal).toHaveBeenCalledOnce();
    });

    it("resetter isAutoRenewing slik at ny auto-renew trigges i neste token-syklus", () => {
        tokenDialog.checkActivity = () => true;
        tokenDialog.tokenExpireAtLocal = addSecondsFromNow(250);

        const renewSpy = vi.fn();
        tokenDialog.addEventListener("renew", renewSpy);

        tick();
        expect(renewSpy).toHaveBeenCalledTimes(1);

        // Simular at token ble fornyet (nytt tokenExpireAtLocal)
        tokenDialog.tokenExpireAtLocal = addSecondsFromNow(3600);
        tick(); // secondsRemaining > 5 min → isAutoRenewing reset
        expect(dialog.close).toHaveBeenCalled();

        // Token nærmer seg utløp igjen
        tokenDialog.tokenExpireAtLocal = addSecondsFromNow(250);
        tick();
        expect(renewSpy).toHaveBeenCalledTimes(2);
    });
});
