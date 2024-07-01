import {
    afterAll,
    afterEach,
    beforeAll,
    describe,
    expect,
    test,
} from "bun:test";
import { HttpResponse, http } from "msw";
import { SetupServerApi, setupServer } from "msw/node";
import { env } from "./env/server";
import {
    Varsler,
    archiveNotification,
    getNotifications,
} from "./notifications";
import { expectOK } from "./test-expect";

describe("notifications", () => {
    let server: SetupServerApi;

    beforeAll(() => {
        server = setupServer(
            http.get(`${env.VARSEL_API_URL}/varselbjelle/varsler`, () =>
                HttpResponse.json<Varsler>({
                    oppgaver: [
                        {
                            eventId: "a",
                            type: "oppgave",
                            tidspunkt: "2023-07-04T11:41:02.280367+02:00",
                            isMasked: true,
                            tekst: null,
                            link: null,
                            eksternVarslingKanaler: [],
                        },
                        {
                            eventId: "b",
                            type: "oppgave",
                            tidspunkt: "2023-07-04T11:43:02.280367+02:00",
                            isMasked: false,
                            eksternVarslingKanaler: ["SMS", "EPOST"],
                            tekst: "wat",
                            link: "http://example.com",
                        },
                    ],
                    beskjeder: [
                        {
                            eventId: "c",
                            type: "beskjed",
                            tidspunkt: "2023-07-04T11:47:02.280367+02:00",
                            eksternVarslingKanaler: ["SMS"],
                            isMasked: false,
                            tekst: "omg",
                            link: "https://developer.mozilla.org/",
                        },
                    ],
                }),
            ),
            http.post(`${env.VARSEL_API_URL}/beskjed/inaktiver`, () =>
                HttpResponse.json({ success: true }),
            ),
        );
        server.listen();
    });
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test("returns transformed notifications", async () => {
        const result = await getNotifications({
            cookie: "cookie",
        });

        expectOK(result);
        expect(result.data).toEqual([
            {
                id: "b",
                type: "task",
                date: "2023-07-04T11:43:02.280367+02:00",
                channels: ["SMS", "EPOST"],
                masked: false,
                text: "wat",
                link: "http://example.com",
            },
            {
                id: "a",
                type: "task",
                date: "2023-07-04T11:41:02.280367+02:00",
                channels: [],
                masked: true,
            },
            {
                id: "c",
                type: "message",
                date: "2023-07-04T11:47:02.280367+02:00",
                channels: ["SMS"],
                masked: false,
                text: "omg",
                link: "https://developer.mozilla.org/",
            },
        ]);
    });

    test("archive notification on POST", async () => {
        const response = await archiveNotification({
            cookie: "",
            id: "eventId",
        });
        expectOK(response);
        expect(response.data).toEqual("eventId");
    });
});
