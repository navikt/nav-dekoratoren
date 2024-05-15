import { analyticsEvents } from "../analytics/constants";
import { logAmplitudeEvent } from "../analytics/amplitude";
import { endpointUrlWithParams } from "../helpers/urls";

class ArchivableNotificaton extends HTMLElement {
    connectedCallback() {
        const id = this.getAttribute("data-id");
        if (id) {
            this.querySelector("button")?.addEventListener("click", () =>
                fetch(
                    endpointUrlWithParams(`/api/notifications/${id}/archive`),
                    { method: "POST" },
                ).then(() => {
                    this.parentElement?.remove();
                    logAmplitudeEvent(...analyticsEvents.arkivertBeskjed);
                }),
            );
        }
    }
}

customElements.define("archivable-notification", ArchivableNotificaton);

class LinkNotification extends HTMLElement {
    connectedCallback() {
        const a = this.querySelector("a");
        if (a) {
            a.addEventListener("click", () => {
                logAmplitudeEvent("navigere", {
                    komponent:
                        this.getAttribute("data-type") === "task"
                            ? "varsel-oppgave"
                            : "varsel-beskjed",
                    kategori: "varselbjelle",
                    destinasjon: a.href,
                });
            });
        }
    }
}

customElements.define("link-notification", LinkNotification);
