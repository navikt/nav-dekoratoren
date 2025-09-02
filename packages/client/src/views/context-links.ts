import { analyticsClickListener } from "../analytics/analytics";
import { AnalyticsKategori } from "../analytics/types";
import headerClasses from "../styles/header.module.css";
import { defineCustomElement } from "./custom-elements";

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
            analyticsClickListener((anchor) => ({
                kategori:
                    (anchor.getAttribute(
                        "data-kategori",
                    ) as AnalyticsKategori) ?? undefined,
                lenkegruppe: "arbeidsflate-valg",
                lenketekst: anchor.getAttribute("data-context") ?? undefined,
                sideskrolling: window.scrollY ?? 0,
            })),
        );
        window.addEventListener("paramsupdated", this.handleParamsUpdated);
    }

    disconnectedCallback() {
        window.removeEventListener("paramsupdated", this.handleParamsUpdated);
    }
}

defineCustomElement("context-links", ContextLinks);
