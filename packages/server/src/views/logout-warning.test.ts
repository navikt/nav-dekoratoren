import { describe, expect, it } from "vitest";
import cls from "decorator-client/src/styles/modal.module.css";
import { logoutWarningHook } from "decorator-shared/views/logout-warning";
import { LogoutWarning } from "./logout-warning";

describe("LogoutWarning", () => {
    it("renders the logout warning dialog contract", () => {
        const output = LogoutWarning().render({ language: "nb" });

        expect(output).toContain("<logout-warning>");
        expect(output).toContain(
            `<token-dialog data-hydrate="${logoutWarningHook.tokenDialog}">`,
        );
        expect(output).toContain(
            `<session-dialog data-hydrate="${logoutWarningHook.sessionDialog}">`,
        );
        expect(output).toContain(`class="${cls.modal}"`);
        expect(output).toContain(`data-hydrate="${logoutWarningHook.dialog}"`);
        expect(output).toContain(`class="${cls.modalWindow}"`);
        expect(output).toContain(`data-hydrate="${logoutWarningHook.form}"`);
        expect(output).toContain(`class="${cls.modalTitle}"`);
        expect(output).toContain(`class="${cls.modalBody}"`);
        expect(output).toContain(`class="${cls.buttonWrapper}"`);
        expect(output).toContain('name="action" value="renew"');
        expect(output).toContain('name="action" value="logout"');
        expect(output).toContain("Du blir snart logget ut automatisk");
        expect(output).toContain(
            `data-hydrate="${logoutWarningHook.timeRemaining}"`,
        );
    });
});
