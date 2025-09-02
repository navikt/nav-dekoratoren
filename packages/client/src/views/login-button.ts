import { parseUrl } from "../helpers/urls";
import { env } from "../params";
import { defineCustomElement } from "./custom-elements";
import { analyticsClickListener } from "../analytics/analytics";

class LoginButton extends HTMLElement {
    connectedCallback() {
        window.addEventListener("paramsupdated", this.update);
        this.update();
        this.addEventListener(
            "click",
            analyticsClickListener(() => ({
                kategori: "dekorator-header",
                lenketekst: "Logg inn",
                komponent: "LoginButton",
                sideskrolling: window.scrollY ?? 0,
            })),
        );
    }

    disconnectedCallback() {
        window.removeEventListener("paramsupdated", this.update);
    }

    update = () => {
        const link = this.querySelector("a");
        const href = link?.getAttribute("href") ?? "";

        const url = parseUrl(href);
        if (!url) {
            console.error(`Invalid URL for login: ${href}`);
            return;
        }

        const { redirectToApp, redirectToUrl, context, level, language } =
            window.__DECORATOR_DATA__.params;

        const getRedirectUrl = () => {
            if (redirectToUrl) {
                return redirectToUrl;
            } else if (redirectToApp) {
                return `${window.location.origin}${window.location.pathname}`;
            } else if (context === "arbeidsgiver") {
                return env("MIN_SIDE_ARBEIDSGIVER_URL");
            } else {
                return env("MIN_SIDE_URL");
            }
        };

        url.searchParams.set("redirect", getRedirectUrl());
        url.searchParams.set("level", level || "Level3");
        url.searchParams.set(
            "locale",
            {
                nb: "nb",
                nn: "nn",
                se: "se",
                en: "en",
                pl: "en",
                uk: "en",
                ru: "en",
            }[language],
        );
        link?.setAttribute("href", url.toString());
    };
}

defineCustomElement("login-button", LoginButton);
