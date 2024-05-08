import { CustomEvents } from "../events";
import { param } from "../params";
import { ResponseCache } from "decorator-shared/cache";

const ONE_MIN_MS = 60 * 1000;

class UserMenu extends HTMLElement {
    private readonly responseCache = new ResponseCache<string>({
        ttl: ONE_MIN_MS,
    });

    private async fetchMenuHtml() {
        const url = window.makeEndpoint("/user-menu");

        return fetch(url, {
            credentials: "include",
        }).then((res) => res.text());
    }

    private buildCacheKey = () => {
        return `${param("context")}_${param("language")}`;
    };

    // TODO: some sort of placeholder view while awaiting server response?
    private populateLoggedInMenu = async () => {
        const cacheKey = this.buildCacheKey();

        this.responseCache
            .get(cacheKey, () => this.fetchMenuHtml())
            .then((html) => {
                if (!html) {
                    // TODO: better error handling
                    console.error("Failed to fetch content for user-menu");
                    return;
                }

                this.innerHTML = html;
            });
    };

    private updateMenu = (e: CustomEvent<CustomEvents["paramsupdated"]>) => {
        if (e.detail.params?.context) {
            this.populateLoggedInMenu();
        }
    };

    private connectedCallback() {
        console.log("User menu connected");
        window.addEventListener("paramsupdated", this.updateMenu);
        window.addEventListener("authupdated", this.populateLoggedInMenu);
    }

    private disconnectedCallback() {
        window.removeEventListener("paramsupdated", this.updateMenu);
        window.removeEventListener("authupdated", this.populateLoggedInMenu);
    }
}

customElements.define("user-menu", UserMenu);
