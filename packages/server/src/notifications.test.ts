import {
    afterAll,
    afterEach,
    beforeAll,
    describe,
    expect,
    test,
} from "bun:test";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { env } from "./env/server";
import notificationsMock from "./notifications-mock.json";
import { getNotifications } from "./notifications";
import { texts } from "./texts";

const server = setupServer(
    http.get(`${env.VARSEL_API_URL}/varselbjelle/varsler`, () =>
        HttpResponse.json(notificationsMock),
    ),
);

describe("notifications service", () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test("returns first five results", async () => {
        const result = await getNotifications({
            texts: texts.nb,
            request: new Request("http://example.com", {
                headers: { cookie: "cookie" },
            }),
        });

        expect(result.length).toBe(5);

        expect(result[0].isArchivable).toBe(false);
        expect(result[0].title).toBe("Oppgave");
        expect(result[0].text).toBe(
            "Du har fått en oppgave, logg inn med høyere sikkerhetsnivå for å se oppgaven.",
        );
        expect(result[0].metadata).toBeUndefined();

        expect(result[2].isArchivable).toBe(true);
        expect(result[2].title).toBe("Beskjed");
        expect(result[2].text).toBe(
            "Du har fått en melding, logg inn med høyere sikkerhetsnivå for å se meldingen.",
        );

        expect(result[4].metadata).toBe("Varslet på SMS");
    });
});
