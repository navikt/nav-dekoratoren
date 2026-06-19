import { describe, expect, it } from "vitest";
import html from "decorator-shared/html";
import { getRequiredElement, templateToFragment } from "./dom";

describe("getRequiredElement", () => {
    it("returns matching elements", () => {
        document.body.innerHTML = '<button class="target">Click</button>';

        const element = getRequiredElement<HTMLButtonElement>(
            document,
            ".target",
        );

        expect(element.textContent).toBe("Click");
    });

    it("throws when markup contract is missing", () => {
        document.body.innerHTML = "";

        expect(() => getRequiredElement(document, ".missing")).toThrow(
            "Missing required element: .missing",
        );
    });
});

describe("templateToFragment", () => {
    it("renders shared templates into document fragments", () => {
        const fragment = templateToFragment(
            html`<button type="button">${"<unsafe>"}</button>`,
            "nb",
        );

        const button = fragment.querySelector("button");
        expect(button?.textContent).toBe("<unsafe>");
        expect(button?.innerHTML).toBe("&lt;unsafe&gt;");
    });
});
