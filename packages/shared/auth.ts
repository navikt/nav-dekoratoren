import { Params } from "./params";
import { LoginButton } from "decorator-server/src/views/login-button";

export const getLogOutUrl = (params: Params) => {
    if (params.redirectToLogout) {
        return `${params.logoutUrl}?redirect=${params.redirectToUrl}`;
    }

    return params.logoutUrl;
};

export const loggedOutResponseData = (loginText: string): AuthDataResponse => ({
    auth: {
        authenticated: false,
    },
    usermenuHtml: LoginButton(loginText).render(),
});

export type AuthLoggedIn = {
    authenticated: true;
    name: string;
    securityLevel: "3" | "4";
};

export type AuthLoggedOut = {
    authenticated: false;
};

export type Auth = AuthLoggedIn | AuthLoggedOut;

export type AuthDataResponse = {
    auth: Auth;
    usermenuHtml: string;
};
