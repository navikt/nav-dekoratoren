import { amplitudeClickListener } from "../analytics/amplitude";
import { defineCustomElement } from "../custom-elements";

class SearchHit extends HTMLElement {
    connectedCallback() {
        this.addEventListener(
            "click",
            amplitudeClickListener(() => ({
                eventName: "resultat-klikk",
                destinasjon: "[redacted]",
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
