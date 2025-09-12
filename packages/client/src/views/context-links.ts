import { analyticsClickListener } from "../analytics/analytics";
import { AnalyticsKategori } from "../analytics/types";
import headerClasses from "../styles/header.module.css";
import { defineCustomElement } from "./custom-elements";

class ContextLinks extends HTMLElement {
    handleParamsUpdated = (event: CustomEvent) => {
        const ctx = event.detail.params.context;
        if (!ctx) return;
        this.querySelectorAll("a").forEach((a) => {
            a.classList.toggle(
                headerClasses.lenkeActive,
                a.getAttribute("data-context") === `/${ctx}`,
            );
        });
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
            })),
        );
        window.addEventListener("paramsupdated", this.handleParamsUpdated);
    }

    disconnectedCallback() {
        window.removeEventListener("paramsupdated", this.handleParamsUpdated);
    }
}

defineCustomElement("context-links", ContextLinks);
