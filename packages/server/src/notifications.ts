import { env } from "./env/server";

type Varsel = {
    eventId: string;
    type: "oppgave" | "beskjed";
    tidspunkt: string;
    isMasked: boolean;
    tekst: string | null;
    link: string | null;
    eksternVarslingKanaler: string[];
};

export type Varsler = {
    oppgaver: Varsel[];
    beskjeder: Varsel[];
};

export type MaskedNotification = {
    id: string;
    type: "task" | "message";
    date: string;
    channels: string[];
    masked: true;
};

export type UnmaskedNotification = {
    id: string;
    type: "task" | "message";
    date: string;
    channels: string[];
    masked: false;
    text: string;
    link?: string;
};

export type Notification = MaskedNotification | UnmaskedNotification;

const varslerToNotifications = (varsler: Varsler): Notification[] =>
    [varsler.oppgaver, varsler.beskjeder].flatMap((list) =>
        list.map(
            (varsel: Varsel): Notification => ({
                id: varsel.eventId,
                type: varsel.type === "beskjed" ? "message" : "task",
                date: varsel.tidspunkt,
                channels: varsel.eksternVarslingKanaler,
                ...(varsel.isMasked
                    ? { masked: true }
                    : {
                          masked: false,
                          text: varsel.tekst ?? "",
                          link: varsel.link ?? undefined,
                      }),
            }),
        ),
    );

export const getNotifications = async ({ request }: { request: Request }) =>
    fetch(`${env.VARSEL_API_URL}/varselbjelle/varsler`, {
        headers: {
            cookie: request.headers.get("cookie") || "",
        },
    })
        .then((res) => res.json() as Promise<Varsler>)
        .then(varslerToNotifications);
