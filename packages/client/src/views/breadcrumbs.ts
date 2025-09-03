import type { Breadcrumb } from "decorator-shared/params";
import { Breadcrumbs as BreadcrumbsTemplate } from "decorator-shared/views/breadcrumbs";
import { CustomEvents } from "../events";
import { env, param } from "../params";
import { defineCustomElement } from "./custom-elements";
import i18n from "./i18n";
import { analyticsClickListener } from "../analytics/analytics";

class Breadcrumbs extends HTMLElement {
    update = (breadcrumbs: Breadcrumb[]) => {
        this.innerHTML =
            BreadcrumbsTemplate({
                breadcrumbs,
                label: i18n("breadcrumbs"),
                frontPageUrl: env("XP_BASE_URL"),
            })?.render({ language: param("language") }) ?? "";
    };

    handleParamsUpdated = (
        event: CustomEvent<CustomEvents["paramsupdated"]>,
    ) => {
        if (event.detail.params.breadcrumbs) {
            this.update(event.detail.params.breadcrumbs);
        }
    };

    handleClick = (e: MouseEvent) => {
        const anchor =
            e.target instanceof Element ? e.target.closest("a") : null;
        if (anchor && anchor.hasAttribute("data-handle-in-app")) {
            e.preventDefault();
            window.postMessage({
                source: "decorator",
                event: "breadcrumbClick",
                payload: {
                    url: anchor.getAttribute("href"),
                    title: anchor.textContent?.trim() ?? "",
                    handleInApp: true,
                },
            });
        }
    };

    connectedCallback() {
        window.addEventListener("paramsupdated", this.handleParamsUpdated);
        this.update(param("breadcrumbs"));
        this.addEventListener("click", this.handleClick);
        this.addEventListener(
            "click",
            analyticsClickListener((anchor) => ({
                kategori: "dekorator-brodsmuler",
                komponent: "Breadcrumbs",
                lenketekst:
                    anchor.getAttribute("data-analytics-title") || "[redacted]",
            })),
        );
    }

    disconnectedCallback() {
        window.removeEventListener("paramsupdated", this.handleParamsUpdated);
    }
}

defineCustomElement("d-breadcrumbs", Breadcrumbs);
