import { AuthDataResponse, loggedOutResponseData } from "decorator-shared/auth";
import { createEvent, CustomEvents } from "./events";
import { endpointUrlWithParams } from "./helpers/urls";

const fetchAuthData = async (): Promise<AuthDataResponse> => {
    const url = endpointUrlWithParams("/auth");

    return fetch(url, {
        credentials: "include",
    })
        .then((res) => res.json() as Promise<AuthDataResponse>)
        .catch((error) => {
            console.error(`Failed to fetch auth data - ${error}`);
            return loggedOutResponseData(window.__DECORATOR_DATA__.texts.login);
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
