import { logger } from "../helpers/logger";
import { logAnalyticsEvent } from "../analytics/analytics";
import { defineCustomElement } from "./custom-elements";
import { decoratorApi, decoratorParams } from "../helpers/api";

const decoratorApiWithoutRetries = decoratorApi.extend({ retry: 0 });

class ArchivableNotification extends HTMLElement {
    private readonly archiveNotifications = async () => {
        const id = this.getAttribute("data-id");
        try {
            await decoratorApi(`/api/notifications/${id}/archive`, {
                query: decoratorParams(),
                method: "POST",
                credentials: "include",
            });
            this.parentElement?.remove();
            logAnalyticsEvent("arkivert-beskjed", {
                kategori: "dekorator-varsler",
                komponent: "varsler-beskjed-arkiverbar",
            });
        } catch (error) {
            // TODO: hva skal vi vise hvis arkivering feiler?
            logger.error("Failed to archive notifications from button", {
                error,
            });
        }
    };

    connectedCallback() {
        const id = this.getAttribute("data-id");
        if (!id) {
            return;
        }

        this.querySelector("button")?.addEventListener(
            "click",
            this.archiveNotifications,
        );
    }
}

defineCustomElement("archivable-notification", ArchivableNotification);

class LinkNotification extends HTMLElement {
    connectedCallback() {
        const anchorElement = this.querySelector("a");
        if (!anchorElement) {
            return;
        }

        const id = this.getAttribute("data-id");
        if (!id) {
            return;
        }

        const type = this.getAttribute("data-type");

        anchorElement.addEventListener("click", () => {
            if (type === "inbox") {
                logAnalyticsEvent("navigere", {
                    komponent: "varsel-innboks",
                    kategori: "varselbjelle",
                    destinasjon: anchorElement.href,
                });
                return;
            }

            if (type === "message") {
                // We don't want to retry because of keepalive
                decoratorApiWithoutRetries(`/api/notifications/${id}/archive`, {
                    query: decoratorParams(),
                    method: "POST",
                    credentials: "include",
                    keepalive: true,
                })
                    .then(() => {
                        this.parentElement?.remove();
                    })
                    .catch((error) => {
                        // TODO: hva skal vi vise hvis poste done-event feiler?
                        logger.error(
                            "Failed to archive notifications from link",
                            { error },
                        );
                    });
            }

            logAnalyticsEvent("navigere", {
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

defineCustomElement("link-notification", LinkNotification);
