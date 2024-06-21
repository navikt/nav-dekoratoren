import html from "decorator-shared/html";
import debounce from "lodash.debounce";
import cls from "../styles/search-form.module.css";
import { env, param } from "../params";
import { amplitudeEvent } from "../analytics/amplitude";

class SearchMenu extends HTMLElement {
    form: HTMLFormElement | null = null;
    input: HTMLInputElement | null = null;
    parentDropdown: HTMLInputElement | null = null;
    hits: HTMLElement;

    constructor() {
        super();
        this.hits = document.createElement("div");
    }

    clearSearch = () => {
        const mainMenu = document.getElementById("decorator-main-menu");
        this.hits.remove();
        if (this.input) {
            this.input.value = "";
        }
        mainMenu && mainMenu.classList.remove("hidden");
    };

    focus = () => this.input?.focus();

    connectedCallback() {
        this.form = this.querySelector(`.${cls.searchForm}`);
        this.input = this.querySelector(`.${cls.searchInput}`);
        this.parentDropdown = this.closest("dropdown-menu");

        if (this.getAttribute("data-auto-focus") !== null) {
            this.parentDropdown?.addEventListener("menuopened", this.focus);
        }

        this.parentDropdown?.addEventListener("menuclosed", this.clearSearch);

        this.addEventListener("clearsearch", this.clearSearch);

        this.form?.addEventListener("submit", (e) => {
            e.preventDefault();
            const xpOrigin = env("XP_BASE_URL");
            window.location.assign(`${xpOrigin}/sok?ord=${this.input?.value}`);
        });

        const fetchSearch = (query: string) => {
            const url = `${env("APP_URL")}/api/search?${Object.entries({
                language: param("language"),
                context: param("context"),
                q: encodeURIComponent(query),
            })
                .map(([key, value]) => `${key}=${value}`)
                .join("&")}`;

            amplitudeEvent({
                eventName: "søk",
                destination: url,
                category: "dekorator-header",
                label: query,
                action: "søk-dynamisk",
            });

            return fetch(url)
                .then((res) => res.text())
                .then((text) => {
                    if (this.input?.value === query) {
                        this.hits.innerHTML = text;
                    }
                });
        };

        const fetchSearchDebounced = debounce(fetchSearch, 500);

        this.input?.addEventListener("input", (e) => {
            const mainMenu = document.getElementById("decorator-main-menu");
            const { value } = e.target as HTMLInputElement;
            if (value.length > 2) {
                this.append(this.hits);
                this.hits.innerHTML = html`<decorator-loader
                    title="${window.__DECORATOR_DATA__.texts.loading_preview}"
                />`.render();
                mainMenu && mainMenu.classList.add("hidden");
                fetchSearchDebounced(value);
            } else {
                mainMenu && mainMenu.classList.remove("hidden");
                this.hits.remove();
            }
        });
    }

    disconnectedCallback() {
        if (this.getAttribute("data-auto-focus") !== null) {
            this.parentDropdown?.removeEventListener("menuopened", this.focus);
        }
        this.parentDropdown?.removeEventListener(
            "menuclosed",
            this.clearSearch,
        );
    }
}

customElements.define("search-menu", SearchMenu);
