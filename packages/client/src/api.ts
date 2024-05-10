import { LoginLevel } from "decorator-shared/params";

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
