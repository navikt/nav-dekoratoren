import { Breadcrumb } from "decorator-shared/params";
import { Breadcrumbs as BreadcrumbsTemplate } from "decorator-shared/views/breadcrumbs";
import { amplitudeClickListener } from "../analytics/amplitude";
import { defineCustomElement } from "../custom-elements";
import { CustomEvents } from "../events";
import i18n from "../i18n";
import { env, param } from "../params";

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

    handleClick = (event: MouseEvent) => {
        if (
            event.target instanceof HTMLAnchorElement &&
            event.target.getAttribute("data-handle-in-app") !== null
        ) {
            event.preventDefault();
            window.postMessage({
                source: "decorator",
                event: "breadcrumbClick",
                payload: {
                    url: event.target.href,
                    title:
                        event.target.getAttribute("data-title") ??
                        event.target.textContent?.trim() ??
                        "",
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
            amplitudeClickListener((anchor) => ({
                category: "dekorator-header",
                komponent: "brødsmule",
                action:
                    anchor.getAttribute("data-title") ??
                    anchor.textContent?.trim() ??
                    "",
            })),
        );
    }

    disconnectedCallback() {
        window.removeEventListener("paramsupdated", this.handleParamsUpdated);
    }
}

defineCustomElement("d-breadcrumbs", Breadcrumbs);
