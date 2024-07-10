import { amplitudeEvent } from "../analytics/amplitude";
import { defineCustomElement } from "../custom-elements";
import { param } from "../params";
import headerClasses from "../styles/header.module.css";

class ContextLinks extends HTMLElement {
    handleClick(event: MouseEvent) {
        if (event.target instanceof HTMLAnchorElement) {
            const context = event.target.getAttribute("data-context");

            if (context) {
                amplitudeEvent({
                    context: param("context"),
                    action: "arbeidsflate-valg",
                    category: "dekorator-header",
                    label: context,
                });
            }
        }
    }

    handleParamsUpdated = (event: CustomEvent) => {
        if (event.detail.params.context) {
            this.querySelectorAll("a").forEach((anchor) => {
                anchor.classList.toggle(
                    headerClasses.lenkeActive,
                    anchor.getAttribute("data-context") ===
                        event.detail.params.context,
                );
            });
        }
    };

    connectedCallback() {
        this.addEventListener("click", this.handleClick);
        window.addEventListener("paramsupdated", this.handleParamsUpdated);
    }

    disconnectedCallback() {
        window.removeEventListener("paramsupdated", this.handleParamsUpdated);
    }
}

defineCustomElement("context-links", ContextLinks);
