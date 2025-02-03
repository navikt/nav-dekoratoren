import { analyticsClickListener } from "../analytics/analytics";
import { defineCustomElement } from "./custom-elements";

class SearchHit extends HTMLElement {
    connectedCallback() {
        this.addEventListener(
            "click",
            analyticsClickListener(() => ({
                eventName: "resultat-klikk",
                sokeord: "[redacted]",
                treffnr:
                    [...this.closest("ul")!.children].findIndex((el) =>
                        el.contains(this),
                    ) + 1,
            })),
        );
    }
}

defineCustomElement("search-hit", SearchHit);
