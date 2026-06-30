import { texts } from "decorator-server/src/texts";
import { screensharingModalHook } from "decorator-shared/views/screensharing-modal";
import clsInputs from "../styles/inputs.module.css";
import "./screensharing-modal";

describe("screensharing-modal", () => {
    beforeEach(() => {
        window.__DECORATOR_DATA__ = {
            params: {
                shareScreen: true,
            },
            features: {
                "dekoratoren.skjermdeling": true,
                "dekoratoren.puzzel-script": false,
            },
            env: {},
            texts: texts.nb,
        } as any;

        document.body.innerHTML = "";
    });

    it("does not require form markup when the modal is disabled", () => {
        const element = document.createElement("screensharing-modal");
        element.innerHTML = `<dialog data-hydrate="${screensharingModalHook.dialog}" data-status="disabled"></dialog>`;

        expect(() => document.body.appendChild(element)).not.toThrow();
    });

    it("wires enabled modal form controls through hydration hooks", () => {
        const close = vi.fn();
        HTMLDialogElement.prototype.close = close;

        const element = document.createElement("screensharing-modal");
        element.innerHTML = `
            <dialog data-hydrate="${screensharingModalHook.dialog}" data-status="enabled">
                <form data-hydrate="${screensharingModalHook.form}">
                    <input
                        data-hydrate="${screensharingModalHook.input}"
                        name="screensharing_code"
                        value="123"
                    />
                    <ul data-hydrate="${screensharingModalHook.errors}"></ul>
                    <button
                        type="button"
                        data-hydrate="${screensharingModalHook.cancel}"
                    >
                        Cancel
                    </button>
                </form>
            </dialog>
        `;

        document.body.appendChild(element);

        const form = element.querySelector("form")!;
        const input = element.querySelector<HTMLInputElement>("input")!;
        const errors = element.querySelector("ul")!;
        const cancel = element.querySelector("button")!;

        form.dispatchEvent(
            new SubmitEvent("submit", { bubbles: true, cancelable: true }),
        );

        expect(input.classList.contains(clsInputs.invalid)).toBe(true);
        expect(errors.classList.contains(clsInputs.showErrors)).toBe(true);

        input.dispatchEvent(new Event("input"));
        expect(errors.classList.contains(clsInputs.showErrors)).toBe(false);

        cancel.click();
        expect(close).toHaveBeenCalled();
    });
});
