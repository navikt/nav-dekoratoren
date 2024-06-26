import { LoginButton } from "./views/login-button";
import { Context, Language, Params } from "./params";
import { Template } from "./html";

export const loggedOutResponseData = (
    loginText: Template,
    params: { language: Language; context: Context },
): AuthDataResponse => ({
    auth: { authenticated: false },
    usermenuHtml: LoginButton(loginText).render(params),
});

export const getLogOutUrl = (params: Params) => {
    if (params.redirectToLogout) {
        return `${params.logoutUrl}?redirect=${params.redirectToUrl}`;
    }

    return params.logoutUrl;
};

export type AuthLoggedIn = {
    authenticated: true;
    name: string;
    securityLevel: "3" | "4";
};

type AuthLoggedOut = {
    authenticated: false;
};

export type Auth = AuthLoggedIn | AuthLoggedOut;

export type AuthDataResponse = {
    auth: Auth;
    usermenuHtml: string;
};
