import cls from "../styles/dropdown-menu.module.css";
import { createEvent } from "../events";
import { addCustomElement } from "../custom-elements";

class DropdownMenu extends HTMLElement {
    button: HTMLElement | null = null;
    #open: boolean = false;

    handleWindowClick = (e: MouseEvent) => {
        if (!this.contains(e.target as Node)) {
            this.open = false;
        }
    };

    set open(open: boolean) {
        if (open === this.#open) {
            return;
        }

        this.classList.toggle(cls.dropdownMenuOpen, open);
        this.button?.setAttribute("aria-expanded", JSON.stringify(open));
        this.#open = open;
        this.dispatchEvent(
            createEvent(open ? "menuopened" : "menuclosed", { bubbles: true }),
        );
    }

    close = () => {
        this.open = false;
    };

    connectedCallback() {
        this.button = this.querySelector(":scope > button");
        if (this.button) {
            this.button.addEventListener("click", () => {
                this.open = !this.#open;
            });
            this.button.setAttribute("aria-expanded", "false");
        }

        window.addEventListener("click", this.handleWindowClick);
        window.addEventListener("closemenus", this.close);
    }

    disconnectedCallback() {
        window.removeEventListener("click", this.handleWindowClick);
        window.removeEventListener("closemenus", this.close);
    }
}

addCustomElement("dropdown-menu", DropdownMenu);
