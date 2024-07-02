import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";
import {
    nowISOString,
    addOneHourFromNow,
    getSecondsRemaining,
    addSixHoursFromNow,
} from "./helpers/time";

export const worker = setupWorker(
    http.get("http://localhost:8089/api/oauth2/session", () =>
        HttpResponse.json({
            session: {
                created_at: nowISOString(),
                ends_at: addSixHoursFromNow(),
                timeout_at: addOneHourFromNow(),
                ends_in_seconds: getSecondsRemaining(addSixHoursFromNow()),
                active: true,
                timeout_in_seconds: getSecondsRemaining(addOneHourFromNow()),
            },
            tokens: {
                expire_at: addOneHourFromNow(),
                refreshed_at: nowISOString(),
                expire_in_seconds: getSecondsRemaining(addOneHourFromNow()),
                next_auto_refresh_in_seconds: -1,
                refresh_cooldown: true,
                refresh_cooldown_seconds: 31,
            },
        }),
    ),
    http.get("http://localhost:8089/api/oauth2/session/refresh", () =>
        HttpResponse.json({
            session: {
                created_at: nowISOString(),
                ends_at: addSixHoursFromNow(),
                timeout_at: addOneHourFromNow(),
                ends_in_seconds: getSecondsRemaining(addSixHoursFromNow()),
                active: true,
                timeout_in_seconds: getSecondsRemaining(addOneHourFromNow()),
            },
            tokens: {
                expire_at: addOneHourFromNow(),
                refreshed_at: nowISOString(),
                expire_in_seconds: getSecondsRemaining(addOneHourFromNow()),
                next_auto_refresh_in_seconds: -1,
                refresh_cooldown: true,
                refresh_cooldown_seconds: 31,
            },
        }),
    ),
);
