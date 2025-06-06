import { analyticsClickListener } from "../analytics/analytics";
import { defineCustomElement } from "./custom-elements";

const DEFERRED_UPDATE_TIME = 5000;

// TODO: add event listener for SPA navigation

class SkipLinkElement extends HTMLElement {
    private hasMainContent() {
        return !!document.getElementById("maincontent");
    }

    private updateDisplay() {
        this.style.display = this.hasMainContent() ? "" : "none";
    }

    // Handles the case of client-side rendered maincontent element,
    // which may occur after the initial maincontent check
    private deferredUpdate() {
        const observer = new MutationObserver(() => {
            this.updateDisplay();
        });

        observer.observe(document.body, {
            attributeFilter: ["id"],
            childList: true,
            subtree: true,
        });

        setTimeout(() => observer.disconnect(), DEFERRED_UPDATE_TIME);
    }

    connectedCallback() {
        this.addEventListener(
            "click",
            analyticsClickListener(() => ({
                kategori: "dekorator-header",
                lenketekst: "skiplink",
            })),
        );

        this.updateDisplay();
        if (!this.hasMainContent()) {
            this.deferredUpdate();
        }
    }
}

defineCustomElement("skip-link", SkipLinkElement);
