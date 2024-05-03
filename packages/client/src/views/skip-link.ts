import { LenkeMedSporingElement } from "./lenke-med-sporing";

const MAINCONTENT_ID = "maincontent";

class SkipLinkElement extends LenkeMedSporingElement {
    // Handles client-side rendering of the maincontent element
    // TODO: Is this worth the potential performance hit? :|
    private readonly observer = new MutationObserver(() =>
        this.updateVisibility(),
    );

    private updateVisibility() {
        const hasMainContentElement = !!document.getElementById(MAINCONTENT_ID);
        this.style.display = hasMainContentElement ? "" : "none";
    }

    private connectedCallback() {
        this.updateVisibility();
        this.observer.observe(document.body, {
            attributeFilter: ["id"],
            childList: true,
            subtree: true,
        });
    }

    private disconnectedCallback() {
        this.observer.disconnect();
    }
}

customElements.define("skip-link", SkipLinkElement);
