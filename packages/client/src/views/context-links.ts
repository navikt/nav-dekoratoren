import { amplitudeClickListener } from "../analytics/amplitude";
import { defineCustomElement } from "../custom-elements";
import headerClasses from "../styles/header.module.css";

class ContextLinks extends HTMLElement {
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
        this.addEventListener(
            "click",
            amplitudeClickListener((anchor) => ({
                action: "arbeidsflate-valg",
                category: "dekorator-header",
                label: anchor.getAttribute("data-context") ?? undefined,
            })),
        );
        window.addEventListener("paramsupdated", this.handleParamsUpdated);
    }

    disconnectedCallback() {
        window.removeEventListener("paramsupdated", this.handleParamsUpdated);
    }
}

defineCustomElement("context-links", ContextLinks);
