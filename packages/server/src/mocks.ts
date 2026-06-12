import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import notificationsMock from "./notifications-mock.json";
import { env } from "./env/server";
import testData from "./menu/main-menu-mock.json";
import { OpsMessage } from "decorator-shared/types";

const LOCAL_AUTH_COOKIE_NAME = "decorator-example-auth";
const LOCAL_NOTIFICATIONS_COOKIE_NAME = "decorator-example-notifications";

const getCookieValue = (request: Request, name: string) =>
    request.headers
        .get("cookie")
        ?.split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith(`${name}=`))
        ?.slice(name.length + 1);

const nowISOString = () => {
    return new Date().toISOString();
};

function addSecondsFromNow(seconds: number) {
    return new Date(Date.now() + seconds * 1000).toISOString();
}

const addOneHourFromNow = () => {
    const secondsInAnHour = 60 * 60;
    return addSecondsFromNow(secondsInAnHour);
};

const addSixHoursFromNow = () => {
    const secondsInSixHours = 6 * 60 * 60;
    return addSecondsFromNow(secondsInSixHours);
};

const getSecondsRemaining = (futureDate: string) => {
    if (!futureDate) {
        return 0;
    }

    const nowEpoch = new Date().getTime();
    const futureEpoch = new Date(futureDate).getTime();
    return Math.ceil((futureEpoch - nowEpoch) / 1000);
};

export const setupMocks = () =>
    setupServer(
        http.get(`${env.APP_URL}/api/oauth2/session`, () =>
            HttpResponse.json({
                session: {
                    created_at: nowISOString(),
                    ends_at: addSixHoursFromNow(),
                    timeout_at: addOneHourFromNow(),
                    ends_in_seconds: getSecondsRemaining(addSixHoursFromNow()),
                    active: true,
                    timeout_in_seconds:
                        getSecondsRemaining(addOneHourFromNow()),
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
        http.get(`${env.APP_URL}/api/oauth2/session/refresh`, () =>
            HttpResponse.json({
                session: {
                    created_at: nowISOString(),
                    ends_at: addSixHoursFromNow(),
                    timeout_at: addOneHourFromNow(),
                    ends_in_seconds: getSecondsRemaining(addSixHoursFromNow()),
                    active: true,
                    timeout_in_seconds:
                        getSecondsRemaining(addOneHourFromNow()),
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
        http.get(`${env.ENONICXP_SERVICES}/no.nav.navno/menu`, () =>
            HttpResponse.json(testData),
        ),
        http.get(`${env.APP_URL}/api/varselbjelle/varsler`, ({ request }) => {
            const notificationsState = getCookieValue(
                request,
                LOCAL_NOTIFICATIONS_COOKIE_NAME,
            );

            return HttpResponse.json(
                notificationsState === "empty" ||
                    (!notificationsState &&
                        process.env.MOCK_NOTIFICATIONS === "empty")
                    ? { oppgaver: [], beskjeder: [] }
                    : notificationsMock,
            );
        }),
        http.get(`${env.APP_URL}/api/auth`, ({ request }) => {
            const authState = getCookieValue(request, LOCAL_AUTH_COOKIE_NAME);
            const authLevel =
                authState === "logged-in"
                    ? "4"
                    : authState === "logged-out"
                      ? undefined
                      : process.env.MOCK_AUTH_LEVEL;

            return HttpResponse.json(
                authLevel
                    ? {
                          authenticated: true,
                          name: "Charlie Jensen",
                          securityLevel: authLevel,
                          userId: "12345612345",
                      }
                    : { authenticated: false },
            );
        }),
        http.post(`${env.VARSEL_API_URL}/beskjed/inaktiver`, () =>
            HttpResponse.json({ success: true }),
        ),
        http.get(`${env.ENONICXP_SERVICES}/no.nav.navno/driftsmeldinger`, () =>
            HttpResponse.json([
                {
                    heading: "Ustabile tjenester søndag 15. januar",
                    url: "https://www.nav.no/no/driftsmeldinger/ustabile-tjenester-sondag-15.januar",
                    type: "prodstatus",
                    urlscope: ["http://localhost:8089"],
                },
                {
                    heading: "Svindelforsøk via SMS - vær oppmerksom",
                    url: "https://www.nav.no/no/driftsmeldinger/svindelforsok-via-sms-vaer-oppmerksom20231016",
                    type: "info",
                    urlscope: ["http://localhost:8089/dekoratoren/$"],
                },
            ] satisfies OpsMessage[]),
        ),
    ).listen({
        onUnhandledRequest: "bypass",
    });
