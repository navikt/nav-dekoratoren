import { describe, expect, it } from "vitest";
import html, { htmlAttributes } from "decorator-shared/html";
import cls from "decorator-client/src/styles/dropdown-menu.module.css";
import { dropdownMenuHook } from "decorator-shared/views/dropdown-menu";
import { DropdownMenu } from "./dropdown-menu";
import { UserMenuDropdown } from "./header/user-menu-dropdown";

describe("DropdownMenu", () => {
    it("renders the dropdown SSR contract", () => {
        const output = DropdownMenu({
            button: (attributes) =>
                html`<button ${htmlAttributes(attributes)} type="button">
                    Open
                </button>`,
            dropdownContent: html`<div>Content</div>`,
            dropdownClass: "custom-dropdown",
            attributes: {
                ["menu-type"]: "menu",
            },
        }).render({ language: "nb" });

        expect(output).toContain("<dropdown-menu");
        expect(output).toContain('menu-type="menu"');
        expect(output).toContain('aria-expanded="false"');
        expect(output).toContain(`data-hydrate="${dropdownMenuHook.trigger}"`);
        expect(output).toContain("Open");
        expect(output).toContain(
            `class="${cls.dropdownMenuContainer} custom-dropdown"`,
        );
        expect(output).toContain("<div>Content</div>");
    });

    it("renders the trigger hook from a real dropdown caller", () => {
        const output = UserMenuDropdown({
            name: "Ola Nordmann",
            notifications: null,
            level: "Level4",
            loginUrl: "/login",
            logoutUrl: "/logout",
            minsideUrl: "/minside",
            personopplysningerUrl: "/personopplysninger",
        }).render({ language: "nb" });

        expect(output).toContain(`data-hydrate="${dropdownMenuHook.trigger}"`);
        expect(output).toContain("Ola Nordmann");
    });
});
