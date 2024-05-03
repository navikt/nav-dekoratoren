import { LenkeMedSporingElement } from "./lenke-med-sporing";

const MAINCONTENT_ID = "maincontent";

class SkipLinkElement extends LenkeMedSporingElement {
    private update() {
        const hasMainContentElement = !!document.getElementById(MAINCONTENT_ID);
        this.style.display = hasMainContentElement ? "" : "none";
    }

    connectedCallback() {
        console.log("Connected");
        this.update();
    }
}

customElements.define("skip-link", SkipLinkElement);
