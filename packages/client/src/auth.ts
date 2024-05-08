import { AuthDataResponse } from "decorator-shared/auth";
import { createEvent, CustomEvents } from "./events";

const fetchAuthData = async (): Promise<AuthDataResponse> => {
    // const sessionUrl = window.__DECORATOR_DATA__.env.API_SESSION_URL;

    const url = window.makeEndpoint("/auth-data");

    try {
        const fetchResponse = await fetch(url, {
            credentials: "include",
        });

        const response = await fetchResponse.json();

        // const sessionResponse = await fetch(sessionUrl, {
        //   credentials: "include",
        // });
        // const session = await sessionResponse.json();

        return response as AuthDataResponse;
    } catch (error) {
        console.error(`Failed to check auth - ${error}`);

        return {
            auth: {
                authenticated: false,
            },
        };
    }
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
