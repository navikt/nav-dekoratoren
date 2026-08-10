import html from "decorator-shared/html";
import debounce from "lodash.debounce";
import { env, param } from "../params";
import cls from "../styles/search-form.module.css";
import { defineCustomElement } from "./custom-elements";
import { analyticsEvent } from "../analytics/analytics";
import { decoratorApi, decoratorParams } from "../helpers/api";
import { logger } from "../helpers/logger";
import { isAbortError } from "@itsy/corgi/chonk";

class SearchMenu extends HTMLElement {
    form: HTMLFormElement | null = null;
    input: HTMLInputElement | null = null;
    parentDropdown: HTMLInputElement | null = null;
    hits: HTMLElement;

    // This is an instance attribute so the abort-signals don't conflict amonst instances
    private readonly api = decoratorApi.extend({ abortPrevious: true });

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
        mainMenu?.classList.remove("hidden");
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
            window.location.assign(
                `${xpOrigin}/sok?ord=${this.input?.value}&f=${param("context")}`,
            );
        });

        const fetchSearchDebounced = debounce(this.fetchSearch, 500);

        this.input?.addEventListener("input", (e) => {
            const mainMenu = document.getElementById("decorator-main-menu");
            const { value } = e.target as HTMLInputElement;
            if (value.length > 2) {
                this.append(this.hits);
                this.hits.innerHTML = html`<decorator-loader
                    title="${window.__DECORATOR_DATA__.texts.loading_preview}"
                />`.render(window.__DECORATOR_DATA__.params);
                mainMenu?.classList.add("hidden");
                fetchSearchDebounced(value);
            } else {
                mainMenu?.classList.remove("hidden");
                this.hits.remove();
            }
        });
    }

    private readonly fetchSearch = async (query: string) => {
        analyticsEvent({
            eventName: "søk",
            kategori: "dekorator-header",
            komponent: "SearchMenu",
        });

        try {
            const results = await this.api("/api/search", {
                query: decoratorParams({
                    language: param("language"),
                    context: param("context"),
                    q: encodeURIComponent(query),
                }),
                responseType: "text",
            });
            if (this.input?.value === query) {
                this.hits.innerHTML = results;
            }
        } catch (error) {
            if (isAbortError(error)) return; // don't error-log when we cancel an in-flight promise
            logger.error("Failed to fetch search results", { error });
        }
    };

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

defineCustomElement("search-menu", SearchMenu);
