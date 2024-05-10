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
import { Varsler, getNotifications } from "./notifications";

type AnyOkUnion = {
    ok: boolean;
    [key: string]: unknown;
};

export function expectOK<T extends AnyOkUnion>(
    result: T,
): asserts result is Extract<T, { ok: true }> {
    expect(result.ok).toBe(true);
}

export function expectNotOK<T extends AnyOkUnion>(
    result: T,
): asserts result is Extract<T, { ok: false }> {
    expect(result.ok).toBe(false);
}

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
        );
        server.listen();
    });
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test("returns task", async () => {
        const result = await getNotifications({
            request: new Request("http://example.com", {
                headers: { cookie: "cookie" },
            }),
        });

        expectOK(result);
        expect(result.data).toEqual([
            {
                id: "a",
                type: "task",
                date: "2023-07-04T11:41:02.280367+02:00",
                channels: [],
                masked: true,
            },
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
});
