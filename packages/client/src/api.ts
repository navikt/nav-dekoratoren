import { LoginLevel } from "decorator-shared/params";
import { env } from "./params";
import { AuthDataResponse } from "decorator-shared/auth";

export async function checkAuth(): Promise<AuthDataResponse> {
    const authUrl = `${env("APP_URL")}/auth-data`;
    // const sessionUrl = window.__DECORATOR_DATA__.env.API_SESSION_URL;

    try {
        const fetchResponse = await fetch(authUrl, {
            credentials: "include",
        });

        const response = await fetchResponse.json();

        // const sessionResponse = await fetch(sessionUrl, {
        //   credentials: "include",
        // });

        // const session = await sessionResponse.json();

        return response as AuthDataResponse;
        // const session = await sessionResponse.json();
    } catch (error) {
        console.error(`Failed to check auth - ${error}`);

        return {
            auth: {
                authenticated: false,
            },
        };
    }
}

export function makeLoginUrl(loginLevel: LoginLevel): string {
    return `${window.__DECORATOR_DATA__.env.LOGIN_URL}?redirect=${window.location.href}&level=${loginLevel}`;
}

export function archive(eventId: { eventId: string }) {
    return fetch(
        `${window.__DECORATOR_DATA__.env.VARSEL_API_URL}/notifications/message/archive`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventId),
            credentials: "include",
            keepalive: true,
        },
    ).catch((e) =>
        console.info(
            `Error posting done event for notifications [eventId: ${eventId?.eventId} - error: ${e}]`,
        ),
    );
}
