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

    private validate = (ctx: string | null | undefined): string => {
        return this.allowed.has(ctx ?? "") ? (ctx as string) : "/privatperson";
    };

    private contextFromLocation = (): string => {
        const seg = location.pathname.split("/")[1] ?? "";
        const urlCtx = seg ? `/${seg}` : null;
        return this.validate(urlCtx);
    };

    private updateActive = (context: string) => {
        this.querySelectorAll<HTMLAnchorElement>("a").forEach((anchor) => {
            const isActive = anchor.getAttribute("data-context") === context;
            anchor.classList.toggle(headerClasses.lenkeActive, isActive);
        });
    };

    private resolveAndUpdate = (eventCtxRaw: string | null | undefined) => {
        const eventCtx = this.validate(eventCtxRaw);
        const urlCtx = this.contextFromLocation();
        const chosen = eventCtx === urlCtx ? eventCtx : urlCtx; // URL wins if mismatch
        this.updateActive(chosen);
    };

    private handleParamsUpdated = (event: CustomEvent) => {
        this.resolveAndUpdate(event?.detail?.params?.context ?? null);
    };

    private handlePopState = () => {
        this.updateActive(this.contextFromLocation());
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

        window.addEventListener(
            "paramsupdated",
            this.handleParamsUpdated as EventListener,
        );
        window.addEventListener("popstate", this.handlePopState);

        this.updateActive(this.contextFromLocation());
    }

    disconnectedCallback() {
        window.removeEventListener(
            "paramsupdated",
            this.handleParamsUpdated as EventListener,
        );
        window.removeEventListener("popstate", this.handlePopState);
    }
}

defineCustomElement("context-links", ContextLinks);
