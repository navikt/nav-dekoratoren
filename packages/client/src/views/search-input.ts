import cls from "../styles/search-form.module.css";
import { createEvent } from "../events";

class SearchInput extends HTMLElement {
    clearButton: HTMLButtonElement | null = null;
    input: HTMLInputElement | null = null;

    connectedCallback() {
        this.clearButton = this.querySelector(`.${cls.clear}`);
        this.input = this.querySelector(`.${cls.searchInput}`);

        this.input?.addEventListener("input", (e) => {
            this.clearButton?.classList.toggle(
                cls.visible,
                !!(e.target as HTMLInputElement).value,
            );
        });

        this.clearButton?.addEventListener("click", () => {
            this.clearButton?.classList.remove(cls.visible);
            this.dispatchEvent(createEvent("clearsearch", { bubbles: true }));
            if (this.input) {
                this.input.focus();
            }
        });
    }
}

customElements.define("search-input", SearchInput);
