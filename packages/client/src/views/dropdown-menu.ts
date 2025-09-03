import { createEvent } from "../events";
import cls from "../styles/dropdown-menu.module.css";
import { defineCustomElement } from "./custom-elements";
import { analyticsEvent } from "../analytics/analytics";

type MenuType = "menu" | "user" | "search";
const analyticsLabel = {
    menu: "Meny",
    user: "[Brukernavn]",
    search: "Søk",
} as const;

class DropdownMenu extends HTMLElement {
    private button!: HTMLElement;
    private isOpen: boolean = false;
    private menuType!: MenuType;

    private handleWindowClick = (e: MouseEvent) => {
        if (!this.contains(e.target as Node)) {
            this.close();
        }
    };

    private close = () => this.toggle(false);

    private toggle = (force?: boolean) => {
        if (force === undefined) {
            this.toggle(!this.isOpen);
        } else {
            if (force === this.isOpen) {
                return;
            }
            this.classList.toggle(cls.dropdownMenuOpen, force);
            this.button.setAttribute("aria-expanded", force.toString());
            this.dispatchEvent(
                createEvent(force ? "menuopened" : "menuclosed", {
                    bubbles: true,
                }),
            );
            analyticsEvent({
                eventName: force ? "accordion åpnet" : "accordion lukket",
                context: window.__DECORATOR_DATA__.params.context,
                kategori: "dekorator-header",
                lenketekst: this.menuType && analyticsLabel[this.menuType],
                komponent: "DropDownMenu",
            });
            this.isOpen = force;
        }
    };

    private handleButtonClick = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            this.close();
        }
    };

    connectedCallback() {
        this.button = this.querySelector(":scope > button")!;
        this.button.addEventListener("click", () => this.toggle());
        this.menuType = this.getAttribute("menu-type") as MenuType;
        window.addEventListener("click", this.handleWindowClick);
        window.addEventListener("closemenus", this.close);
        window.addEventListener("keydown", this.handleButtonClick);
    }

    disconnectedCallback() {
        window.removeEventListener("click", this.handleWindowClick);
        window.removeEventListener("closemenus", this.close);
        window.removeEventListener("keydown", this.handleButtonClick);
    }
}

defineCustomElement("dropdown-menu", DropdownMenu);
