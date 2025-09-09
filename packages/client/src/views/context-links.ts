import { analyticsClickListener } from "../analytics/analytics";
import { AnalyticsKategori } from "../analytics/types";
import headerClasses from "../styles/header.module.css";
import { defineCustomElement } from "./custom-elements";

class ContextLinks extends HTMLElement {
    private readonly allowed = new Set([
        "/samarbeidspartner",
        "/privatperson",
        "/arbeidsgiver",
    ]);

    private validate = (ctx: string | null | undefined) =>
        this.allowed.has(ctx ?? "") ? (ctx as string) : "/privatperson";

    private contextFromLocation = () => {
        const seg = location.pathname.split("/")[1] ?? "";
        const urlCtx = seg ? `/${seg}` : null;
        return this.validate(urlCtx);
    };

    handleParamsUpdated = (event: CustomEvent) => {
        if (event.detail.params.context) {
            const eventCtx = this.validate(event.detail.params.context);
            const urlCtx = this.contextFromLocation();
            const chosenCtx = eventCtx === urlCtx ? eventCtx : urlCtx; // URL wins on mismatch

            this.querySelectorAll("a").forEach((anchor) => {
                anchor.classList.toggle(
                    headerClasses.lenkeActive,
                    anchor.getAttribute("data-context") === chosenCtx,
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
            })),
        );
        window.addEventListener("paramsupdated", this.handleParamsUpdated);
    }

    disconnectedCallback() {
        window.removeEventListener("paramsupdated", this.handleParamsUpdated);
    }
}

defineCustomElement("context-links", ContextLinks);
