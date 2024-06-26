import { AuthDataResponse, loggedOutResponseData } from "decorator-shared/auth";
import { createEvent, CustomEvents } from "./events";
import { endpointUrlWithParams } from "./helpers/urls";
import i18n from "./i18n";

const fetchAuthData = async (): Promise<AuthDataResponse> => {
    const url = endpointUrlWithParams("/auth");

    return fetch(url, {
        credentials: "include",
    })
        .then((res) => res.json() as Promise<AuthDataResponse>)
        .catch((error) => {
            console.error(`Failed to fetch auth data - ${error}`);
            return loggedOutResponseData(
                i18n("login"),
                window.__DECORATOR_DATA__.params,
            );
        });
};

const updateAuthData = () =>
    fetchAuthData().then((authResponse) => {
        dispatchEvent(createEvent("authupdated", { detail: authResponse }));
        return authResponse;
    });

const updateAuthOnContextSwitch = (
    e: CustomEvent<CustomEvents["paramsupdated"]>,
) => {
    if (e.detail.params.context) {
        updateAuthData();
    }
};

export const initAuth = () =>
    updateAuthData().then((authResponse) => {
        window.addEventListener("paramsupdated", updateAuthOnContextSwitch);
        return authResponse.auth;
    });
