import { Template } from "./html";
import { Language } from "./params";
import { LoginButton } from "./views/login-button";

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

export const loggedOutResponseData = (
    loginText: Template,
    params: { language: Language },
): AuthDataResponse => ({
    auth: { authenticated: false },
    usermenuHtml: LoginButton(loginText).render(params),
});
