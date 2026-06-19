import type { ClientParams } from "decorator-shared/params";
import { analyticsClickListener } from "../analytics/analytics";
import { AnalyticsKategori } from "../analytics/types";
import { onParamsUpdated } from "../helpers/params-updated";
import headerClasses from "../styles/header.module.css";
import { defineCustomElement } from "./custom-elements";

class ContextLinks extends HTMLElement {
    private unsubscribeParams?: () => void;

    private updateActiveContext = ({ context }: ClientParams) => {
        this.querySelectorAll("a").forEach((anchor) => {
            anchor.classList.toggle(
                headerClasses.lenkeActive,
                anchor.getAttribute("data-context") === context,
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
        this.unsubscribeParams = onParamsUpdated({
            keys: ["context"],
            update: this.updateActiveContext,
        });
    }

    disconnectedCallback() {
        this.unsubscribeParams?.();
    }
}

defineCustomElement("context-links", ContextLinks);
