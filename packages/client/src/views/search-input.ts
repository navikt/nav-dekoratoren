import { searchFormSelector } from "decorator-shared/views/search-form";
import { createEvent } from "../events";
import { getRequiredElement } from "../helpers/dom";
import utils from "../styles/utils.module.css";
import { defineCustomElement } from "./custom-elements";

class SearchInput extends HTMLElement {
    clearButton!: HTMLButtonElement;
    input!: HTMLInputElement;

    connectedCallback() {
        this.clearButton = getRequiredElement(this, searchFormSelector.clear);
        this.input = getRequiredElement(this, searchFormSelector.input);

        this.input.addEventListener("input", (e) => {
            this.clearButton.classList.toggle(
                utils.hidden,
                !(e.target as HTMLInputElement).value,
            );
        });

        this.clearButton.addEventListener("click", () => {
            this.clearButton.classList.add(utils.hidden);
            this.dispatchEvent(createEvent("clearsearch", { bubbles: true }));
            this.input.focus();
        });
    }
}

defineCustomElement("search-input", SearchInput);
