import { CustomEvents } from "../events";
import { param } from "../params";

class UserMenu extends HTMLElement {
    private buildCacheKey = () => {
        return `${param("context")}_${param("language")}`;
    };

    // TODO: some sort of placeholder view while awaiting server response?
    private populateLoggedInMenu = async () => {
        // const cacheKey = this.buildCacheKey();
        //
        // this.responseCache
        //     .get(cacheKey, () => this.fetchMenuHtml())
        //     .then((html) => {
        //         if (!html) {
        //             // TODO: better error handling
        //             console.error("Failed to fetch content for user-menu");
        //             return;
        //         }
        //
        //         this.innerHTML = html;
        //     });
    };

    private onParamsUpdated = (
        e: CustomEvent<CustomEvents["paramsupdated"]>,
    ) => {
        if (e.detail.params?.context) {
            this.populateLoggedInMenu();
        }
    };

    private onAuthUpdated = (e: CustomEvent<CustomEvents["authupdated"]>) => {
        this.innerHTML = e.detail.usermenuHtml || "Ukjent feil!";
    };

    private connectedCallback() {
        this.populateLoggedInMenu();
        window.addEventListener("paramsupdated", this.onParamsUpdated);
        window.addEventListener("authupdated", this.onAuthUpdated);
    }

    private disconnectedCallback() {
        window.removeEventListener("paramsupdated", this.onParamsUpdated);
        window.removeEventListener("authupdated", this.onAuthUpdated);
    }
}

customElements.define("user-menu", UserMenu);
