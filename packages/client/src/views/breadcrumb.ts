import { LenkeMedSporingElement } from "./lenke-med-sporing";

class Breadcrumb extends LenkeMedSporingElement {
    connectedCallback() {
        super.connectedCallback();

        if (this.getAttribute("data-handle-in-app") !== null) {
            this.addEventListener("click", (e) => {
                e.preventDefault();

                window.postMessage({
                    source: "decorator",
                    event: "breadcrumbClick",
                    payload: {
                        url: this.getAttribute("href"),
                        title: this.innerHTML,
                        handleInApp: true,
                    },
                });
            });
        }
    }
}

customElements.define("d-breadcrumb", Breadcrumb);
