export type AuthLoggedIn = {
    authenticated: true;
    name: string;
    securityLevel: "3" | "4";
};

type AuthLoggedOut = {
    authenticated: false;
};

export type Auth = AuthLoggedIn | AuthLoggedOut;

export type ClientStateResponse = {
    auth: Auth;
    buildId: string;
    usermenuHtml?: string;
};
