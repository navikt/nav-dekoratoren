import { defineCustomElement } from "../custom-elements";
import { env } from "../params";
import { parseUrl } from "../helpers/urls";

class LoginButton extends HTMLElement {
    connectedCallback() {
        window.addEventListener("paramsupdated", this.update);
        this.update();
    }

    disconnectedCallback() {
        window.removeEventListener("paramsupdated", this.update);
    }

    update = () => {
        const link = this.querySelector("a");
        const href = link?.getAttribute("href") ?? "";

        const url = parseUrl(href);
        if (!url) {
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
        url.searchParams.set("level", level);
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
