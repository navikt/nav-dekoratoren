import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import notificationsMock from "./notifications-mock.json";
import { env } from "./env/server";

export default () =>
    setupServer(
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
    ).listen({
        onUnhandledRequest: "bypass",
    });
