import { ClientStateResponse } from "decorator-shared/auth";
import { CustomEvents, createEvent } from "./events";
import { endpointUrlWithParams } from "./helpers/urls";
import { env, param } from "./params";

const fetchClientState = async (): Promise<ClientStateResponse> => {
    const url = endpointUrlWithParams("/client-state");

    return fetch(url, {
        credentials: "include",
    })
        .then((res) => res.json() as Promise<ClientStateResponse>)
        .catch((error) => {
            console.error(`Failed to fetch init data - ${error}`);
            return { auth: { authenticated: false }, buildId: env("BUILD_ID") };
        });
};

const updateClientState = () =>
    fetchClientState().then((response) => {
        dispatchEvent(
            createEvent("client-state-updated", { detail: response }),
        );
        return response;
    });

const updateOnContextSwitch = (
    e: CustomEvent<CustomEvents["paramsupdated"]>,
) => {
    if (e.detail.params.context) {
        updateClientState();
    }
};

export const initClientState = () =>
    updateClientState().then((response) => {
        window.addEventListener("paramsupdated", updateOnContextSwitch);
        return response;
    });
