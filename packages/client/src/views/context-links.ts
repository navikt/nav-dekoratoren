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

    private selectAnchorForContext = (
        context: string,
    ): HTMLAnchorElement | null => {
        const anchors = Array.from(
            this.querySelectorAll<HTMLAnchorElement>("a"),
        );

        let chosen = anchors.find(
            (a) => a.getAttribute("data-context") === context,
        );
        if (chosen) return chosen;

        const seg = context.startsWith("/") ? context.slice(1) : context;
        chosen = anchors.find((a) => {
            const href = a.getAttribute("href") ?? "";
            try {
                const url = new URL(href, location.origin);
                const first = (url.pathname.split("/")[1] ?? "").toLowerCase();
                return first === seg.toLowerCase();
            } catch {
                return false;
            }
        });
        if (chosen) return chosen;

        return (
            anchors.find((a) => {
                const dc = a.getAttribute("data-context");
                return dc === "/privatperson" || dc === "privatperson";
            }) ?? null
        );
    };

    private applyActive = (context: string) => {
        const anchors = Array.from(
            this.querySelectorAll<HTMLAnchorElement>("a"),
        );
        anchors.forEach((a) => a.classList.remove(headerClasses.lenkeActive));

        const activeAnchor = this.selectAnchorForContext(context);
        if (activeAnchor) {
            activeAnchor.classList.add(headerClasses.lenkeActive);
        }
    };

    private resolveAndApply = (eventCtxRaw: string | null | undefined) => {
        const eventCtx = this.validate(eventCtxRaw);
        const urlCtx = this.contextFromLocation();
        const chosen = eventCtx === urlCtx ? eventCtx : urlCtx; // URL wins on mismatch
        this.applyActive(chosen);
    };

    private handleParamsUpdated = (event: CustomEvent) => {
        this.resolveAndApply(event?.detail?.params?.context ?? null);
    };

    private handlePopState = () => {
        this.applyActive(this.contextFromLocation());
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

        this.applyActive(this.contextFromLocation());
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
