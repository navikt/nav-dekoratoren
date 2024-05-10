import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import ContentService from "./content-service";
import menu from "./content-test-data.json";
import { fetchMenu, fetchOpsMessages } from "./enonic";
import { env } from "./env/server";
import notificationsMock from "./notifications-mock.json";
import requestHandler from "./request-handler";
import UnleashService from "./unleash-service";

console.log("Starting decorator-next server");

if (env.NODE_ENV === "development") {
    setupServer(
        http.get(`${env.VARSEL_API_URL}/varselbjelle/varsler`, () =>
            HttpResponse.json(notificationsMock),
        ),
    ).listen();
}

const server = Bun.serve({
    port: 8089,
    development: env.NODE_ENV === "development",
    fetch: await requestHandler(
        new ContentService(
            process.env.NODE_ENV === "production"
                ? fetchMenu
                : () => Promise.resolve(menu),
            process.env.NODE_ENV === "production"
                ? fetchOpsMessages
                : () =>
                      Promise.resolve([
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
        new UnleashService({}),
    ),
});

console.log(
    `decorator-next is running at http://${server.hostname}:${server.port}`,
);
