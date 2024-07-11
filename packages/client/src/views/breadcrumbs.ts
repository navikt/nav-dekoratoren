import { Breadcrumb } from "decorator-shared/params";
import { Breadcrumbs as BreadcrumbsTemplate } from "decorator-shared/views/breadcrumbs";
import { defineCustomElement } from "../custom-elements";
import { CustomEvents } from "../events";
import i18n from "../i18n";
import { param } from "../params";
import { amplitudeEvent } from "../analytics/amplitude";

class Breadcrumbs extends HTMLElement {
    update = (breadcrumbs: Breadcrumb[]) => {
        this.innerHTML =
            BreadcrumbsTemplate({
                breadcrumbs,
                label: i18n("breadcrumbs"),
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
        if (event.target instanceof HTMLAnchorElement) {
            const url = event.target.getAttribute("href") ?? undefined;
            const title =
                event.target.getAttribute("data-title") ??
                event.target.textContent?.trim() ??
                "";

            amplitudeEvent({
                category: "dekorator-header",
                komponent: "brødsmule",
                action: title,
                label: url,
            });

            if (event.target.getAttribute("data-handle-in-app") !== null) {
                event.preventDefault();

                window.postMessage({
                    source: "decorator",
                    event: "breadcrumbClick",
                    payload: { url, title, handleInApp: true },
                });
            }
        }
    };

    connectedCallback() {
        window.addEventListener("paramsupdated", this.handleParamsUpdated);
        this.update(param("breadcrumbs"));
        this.addEventListener("click", this.handleClick);
    }

    disconnectedCallback() {
        window.removeEventListener("paramsupdated", this.handleParamsUpdated);
    }
}

defineCustomElement("d-breadcrumbs", Breadcrumbs);
