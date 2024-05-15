import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import notificationsMock from "./notifications-mock.json";
import { env } from "./env/server";
import testData from "./content-test-data.json";

export const setupMocks = () =>
    setupServer(
        http.get(`${env.ENONICXP_SERVICES}/no.nav.navno/menu`, () =>
            HttpResponse.json(testData),
        ),
        http.get("http://localhost:8089/api/varselbjelle/varsler", () =>
            HttpResponse.json(notificationsMock),
        ),
        http.get("http://localhost:8089/api/auth", () =>
            HttpResponse.json({
                authenticated: true,
                name: "Charlie Jensen",
                securityLevel: "3",
            }),
        ),
        http.post(`${env.VARSEL_API_URL}/beskjed/inaktiver`, () =>
            HttpResponse.json({ success: true }),
        ),
        http.get(`${env.ENONICXP_SERVICES}/no.nav.navno/driftsmeldinger`, () =>
            HttpResponse.json([
                {
                    heading: "Ustabile tjenester søndag 15. januar",
                    url: "https://www.nav.no/no/driftsmeldinger/ustabile-tjenester-sondag-15.januar",
                    type: "prodstatus",
                    urlscope: ["http://localhost:3000/arbeid"],
                },
                {
                    heading: "Svindelforsøk via SMS - vær oppmerksom",
                    url: "https://www.nav.no/no/driftsmeldinger/svindelforsok-via-sms-vaer-oppmerksom20231016",
                    type: "info",
                    urlscope: [],
                },
            ]),
        ),
    ).listen({
        onUnhandledRequest: "bypass",
    });
