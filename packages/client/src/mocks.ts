import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";
import {
    isoDateNow,
    oneHourFromNow,
    secondsFromNow,
    sixHoursFromNow,
} from "./helpers/time";

export const worker = setupWorker(
    http.get("http://localhost:8089/api/oauth2/session", () =>
        HttpResponse.json({
            session: {
                created_at: isoDateNow(),
                ends_at: sixHoursFromNow(),
                timeout_at: oneHourFromNow(),
                ends_in_seconds: secondsFromNow(sixHoursFromNow()),
                active: true,
                timeout_in_seconds: secondsFromNow(oneHourFromNow()),
            },
            tokens: {
                expire_at: oneHourFromNow(),
                refreshed_at: isoDateNow(),
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
                created_at: isoDateNow(),
                ends_at: sixHoursFromNow(),
                timeout_at: oneHourFromNow(),
                ends_in_seconds: secondsFromNow(sixHoursFromNow()),
                active: true,
                timeout_in_seconds: secondsFromNow(oneHourFromNow()),
            },
            tokens: {
                expire_at: oneHourFromNow(),
                refreshed_at: isoDateNow(),
                expire_in_seconds: secondsFromNow(oneHourFromNow()),
                next_auto_refresh_in_seconds: -1,
                refresh_cooldown: true,
                refresh_cooldown_seconds: 31,
            },
        }),
    ),
);
