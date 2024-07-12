import cls from "../styles/dropdown-menu.module.css";
import { createEvent } from "../events";
import { defineCustomElement } from "../custom-elements";

class DropdownMenu extends HTMLElement {
    private button!: HTMLElement;
    private isOpen: boolean = false;

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
            this.isOpen = force;
        }
    };

    connectedCallback() {
        this.button = this.querySelector(":scope > button")!;
        this.button.addEventListener("click", () => this.toggle());

        window.addEventListener("click", this.handleWindowClick);
        window.addEventListener("closemenus", this.close);
    }

    disconnectedCallback() {
        window.removeEventListener("click", this.handleWindowClick);
        window.removeEventListener("closemenus", this.close);
    }
}

defineCustomElement("dropdown-menu", DropdownMenu);
