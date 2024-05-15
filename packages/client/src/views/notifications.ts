import { analyticsEvents } from "../analytics/constants";
import { logAmplitudeEvent } from "../analytics/amplitude";
import { endpointUrlWithParams } from "../helpers/urls";

class ArchivableNotification extends HTMLElement {
    // TODO: hva skal vi vise hvis arkivering feiler?
    private handleError() {}

    connectedCallback() {
        const id = this.getAttribute("data-id");
        if (!id) {
            return;
        }

        this.querySelector("button")?.addEventListener("click", () =>
            fetch(endpointUrlWithParams("/api/notifications/archive", { id }), {
                method: "POST",
            }).then((res) => {
                if (!res.ok) {
                    this.handleError();
                    return;
                }

                this.parentElement?.remove();
                logAmplitudeEvent(...analyticsEvents.arkivertBeskjed);
            }),
        );
    }
}

customElements.define("archivable-notification", ArchivableNotification);

class LinkNotification extends HTMLElement {
    connectedCallback() {
        const anchorElement = this.querySelector("a");
        if (!anchorElement) {
            return;
        }

        anchorElement.addEventListener("click", () => {
            logAmplitudeEvent("navigere", {
                komponent:
                    this.getAttribute("data-type") === "task"
                        ? "varsel-oppgave"
                        : "varsel-beskjed",
                kategori: "varselbjelle",
                destinasjon: anchorElement.href,
            });
        });
    }
}

customElements.define("link-notification", LinkNotification);
