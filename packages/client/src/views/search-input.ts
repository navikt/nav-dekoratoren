import { createEvent } from "../events";
import cls from "../styles/search-form.module.css";
import utils from "../styles/utils.module.css";
import { defineCustomElement } from "./custom-elements";

class SearchInput extends HTMLElement {
    clearButton: HTMLButtonElement | null = null;
    input: HTMLInputElement | null = null;

    connectedCallback() {
        this.clearButton = this.querySelector(`.${cls.clear}`);
        this.input = this.querySelector(`.${cls.searchInput}`);

        this.input?.addEventListener("input", (e) => {
            this.clearButton?.classList.toggle(
                utils.hidden,
                !(e.target as HTMLInputElement).value,
            );
        });

        this.clearButton?.addEventListener("click", () => {
            this.clearButton?.classList.add(utils.hidden);
            this.dispatchEvent(createEvent("clearsearch", { bubbles: true }));
            if (this.input) {
                this.input.focus();
            }
        });
    }
}

defineCustomElement("search-input", SearchInput);
