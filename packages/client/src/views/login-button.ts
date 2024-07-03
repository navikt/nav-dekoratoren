import { env, param } from "../params";
import { Language } from "decorator-shared/params";
import { defineCustomElement } from "../custom-elements";

type IdPortenLocale = "nb" | "nn" | "en" | "se";

const idPortenLocaleMap: Record<Language, IdPortenLocale> = {
    nb: "nb",
    nn: "nn",
    se: "se",
    en: "en",
    pl: "en",
    uk: "en",
    ru: "en",
};

const getLoginRedirectUrl = () => {
    const redirectToUrl = param("redirectToUrl");
    if (redirectToUrl) {
        return redirectToUrl;
    }

    if (param("redirectToApp")) {
        return `${window.location.origin}${window.location.pathname}`;
    }

    if (param("context") === "arbeidsgiver") {
        return env("MIN_SIDE_ARBEIDSGIVER_URL");
    }

    return env("MIN_SIDE_URL");
};

const getLoginUrl = () => {
    const locale = idPortenLocaleMap[param("language")];
    const redirectUrl = getLoginRedirectUrl();

    return `${env("LOGIN_URL")}?redirect=${redirectUrl}&level=${param("level")}&locale=${locale}`;
};

class LoginButton extends HTMLElement {
    connectedCallback() {
        this.addEventListener("click", () => {
            window.location.href = getLoginUrl();
        });
    }
}

defineCustomElement("login-button", LoginButton);
