import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";

const now = () => new Date().toISOString();
const oneHourFromNow = () => {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    return date.toISOString();
};
const sixHoursFromNow = () => {
    const date = new Date();
    date.setHours(date.getHours() + 6);
    return date.toISOString();
};

const secondsFromNow = (isoDate: string) => {
    const now = new Date().getTime();
    const expires = new Date(isoDate).getTime();
    return Math.ceil((expires - now) / 1000);
};

export const worker = setupWorker(
    http.get("http://localhost:8089/api/oauth2/session", () =>
        HttpResponse.json({
            session: {
                created_at: now(),
                ends_at: sixHoursFromNow(),
                timeout_at: oneHourFromNow(),
                ends_in_seconds: secondsFromNow(sixHoursFromNow()),
                active: true,
                timeout_in_seconds: secondsFromNow(oneHourFromNow()),
            },
            tokens: {
                expire_at: oneHourFromNow(),
                refreshed_at: now(),
                expire_in_seconds: secondsFromNow(oneHourFromNow()),
                next_auto_refresh_in_seconds: -1,
                refresh_cooldown: true,
                refresh_cooldown_seconds: 31,
            },
        }),
    ),
    http.get("http://localhost:8089/api/oauth2/session/refresh", () =>
        HttpResponse.json({
            session: {
                created_at: now(),
                ends_at: sixHoursFromNow(),
                timeout_at: oneHourFromNow(),
                ends_in_seconds: secondsFromNow(sixHoursFromNow()),
                active: true,
                timeout_in_seconds: secondsFromNow(oneHourFromNow()),
            },
            tokens: {
                expire_at: oneHourFromNow(),
                refreshed_at: now(),
                expire_in_seconds: secondsFromNow(oneHourFromNow()),
                next_auto_refresh_in_seconds: -1,
                refresh_cooldown: true,
                refresh_cooldown_seconds: 31,
            },
        }),
    ),
);
