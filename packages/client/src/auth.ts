import { AuthDataResponse } from "decorator-shared/auth";
import { createEvent, CustomEvents } from "./events";
import { LoginButton } from "decorator-server/src/views/login-button";

const fetchAuthData = async (): Promise<AuthDataResponse> => {
    const url = window.makeEndpoint("/auth-data");

    return fetch(url, {
        credentials: "include",
    })
        .then((res) => res.json() as Promise<AuthDataResponse>)
        .catch((error) => {
            console.error(`Failed to fetch auth data - ${error}`);

            return {
                auth: {
                    authenticated: false,
                },
                usermenuHtml: LoginButton(
                    window.__DECORATOR_DATA__.texts,
                ).render(),
            };
        });
};

const updateAuthData = () =>
    fetchAuthData().then((authResponse) => {
        dispatchEvent(createEvent("authupdated", { detail: authResponse }));
    });

const updateAuthOnContextSwitch = (
    e: CustomEvent<CustomEvents["paramsupdated"]>,
) => {
    if (e.detail.params.context) {
        updateAuthData();
    }
};

export const initAuth = () => {
    updateAuthData().then(() => {
        window.addEventListener("paramsupdated", updateAuthOnContextSwitch);
    });
};
