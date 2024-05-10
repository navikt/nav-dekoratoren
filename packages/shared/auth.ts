import { Params } from "./params";

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

export type AuthLoggedOut = {
    authenticated: false;
};

export type Auth = AuthLoggedIn | AuthLoggedOut;

export type AuthDataResponse = {
    auth: Auth;
    usermenuHtml: string;
};
