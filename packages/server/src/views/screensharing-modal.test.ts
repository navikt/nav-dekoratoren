import { describe, expect, it } from "vitest";
import clsModal from "decorator-client/src/styles/modal.module.css";
import cls from "decorator-client/src/styles/screensharing-modal.module.css";
import clsButton from "decorator-client/src/styles/screenshare-button.module.css";
import { screensharingModalHook } from "decorator-shared/views/screensharing-modal";
import { getModal } from "./screensharing-modal";
import { ScreenshareButton } from "./footer/screenshare-button";

describe("screensharing modal", () => {
    it("renders enabled modal form contract", () => {
        const output = getModal({ enabled: true }).render({ language: "nb" });

        expect(output).toContain("<screensharing-modal>");
        expect(output).toContain(
            `class="${clsModal.modal} ${cls.screensharingModal}"`,
        );
        expect(output).toContain(
            `data-hydrate="${screensharingModalHook.dialog}"`,
        );
        expect(output).toContain('data-status="enabled"');
        expect(output).toContain(
            `<form data-hydrate="${screensharingModalHook.form}">`,
        );
        expect(output).toContain('id="screensharing_code"');
        expect(output).toContain('name="screensharing_code"');
        expect(output).toContain(
            `data-hydrate="${screensharingModalHook.input}"`,
        );
        expect(output).toContain(
            `data-hydrate="${screensharingModalHook.errors}"`,
        );
        expect(output).toContain(
            `data-hydrate="${screensharingModalHook.cancel}"`,
        );
        expect(output).toContain('data-type="cancel"');
    });

    it("renders disabled modal without form controls", () => {
        const output = getModal({ enabled: false }).render({ language: "nb" });

        expect(output).toContain('data-status="disabled"');
        expect(output).not.toContain("<form>");
        expect(output).not.toContain('name="screensharing_code"');
        expect(output).toContain("stengt");
    });

    it("renders screenshare button contract", () => {
        const output = ScreenshareButton({
            render: () => "Del skjerm",
        }).render({ language: "nb" });

        expect(output).toContain("<screenshare-button>");
        expect(output).toContain(`class="${clsButton.screenshareButton}"`);
        expect(output).toContain("Del skjerm");
        expect(output).toContain('aria-hidden="true"');
    });
});
