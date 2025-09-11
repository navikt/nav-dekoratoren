import { analyticsClickListener } from "../analytics/analytics";
import { AnalyticsKategori } from "../analytics/types";
import headerClasses from "../styles/header.module.css";
import { defineCustomElement } from "./custom-elements";
import { contextSchema } from "decorator-shared/params";

class ContextLinks extends HTMLElement {
    private validate = (ctx: string | null | undefined) => {
        const candidate = ctx ?? "";
        const parsed = (contextSchema as any).safeParse
            ? (contextSchema as any).safeParse(candidate)
            : {
                  success: (contextSchema as any).includes?.(candidate),
                  data: candidate,
              };
        return parsed.success ? parsed.data : "/privatperson";
    };

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
