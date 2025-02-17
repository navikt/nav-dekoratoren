export type AuthLoggedIn = {
    authenticated: true;
    name: string;
    userId: string;
    securityLevel: "3" | "4";
};

type AuthLoggedOut = {
    authenticated: false;
};

export type Auth = AuthLoggedIn | AuthLoggedOut;

export type AuthDataResponse = {
    auth: Auth;
    usermenuHtml?: string;
};
