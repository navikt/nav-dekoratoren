import type { Breadcrumb } from "decorator-shared/params";
import { Breadcrumbs as BreadcrumbsTemplate } from "decorator-shared/views/breadcrumbs";
import { onParamsUpdated } from "../helpers/params-updated";
import { env, param } from "../params";
import { defineCustomElement } from "./custom-elements";
import i18n from "./i18n";
import { analyticsClickListener } from "../analytics/analytics";

class Breadcrumbs extends HTMLElement {
    private unsubscribeParams?: () => void;

    update = (breadcrumbs: Breadcrumb[]) => {
        this.innerHTML =
            BreadcrumbsTemplate({
                breadcrumbs,
                label: i18n("breadcrumbs"),
                frontPageUrl: env("XP_BASE_URL"),
            })?.render({ language: param("language") }) ?? "";
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
        this.unsubscribeParams = onParamsUpdated({
            keys: ["breadcrumbs"],
            update: ({ breadcrumbs }) => this.update(breadcrumbs),
        });
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
        this.unsubscribeParams?.();
    }
}

defineCustomElement("d-breadcrumbs", Breadcrumbs);
