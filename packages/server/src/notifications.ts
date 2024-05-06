import { env } from "./env/server";

type Oppgave = {
    eventId: string;
    varselId: string;
    tidspunkt: string;
    isMasked: boolean;
    tekst: string | null;
    link: string | null;
    type: string;
    eksternVarslingSendt: boolean;
    eksternVarslingKanaler: string[];
};

type Beskjed = {
    eventId: string;
    varselId: string;
    tidspunkt: string;
    isMasked: boolean;
    tekst: string | null;
    link: string | null;
    type: string;
    eksternVarslingSendt: boolean;
    eksternVarslingKanaler: string[];
};

type NotificationData = {
    oppgaver: Oppgave[];
    beskjeder: Beskjed[];
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

const varslerToNotifications = (varsler: NotificationData): Notification[] => {
    const varselToNotification =
        (type: "task" | "message") =>
        (varsel: Beskjed | Oppgave): Notification => ({
            id: varsel.eventId,
            type,
            date: varsel.tidspunkt,
            channels: varsel.eksternVarslingKanaler,
            ...(varsel.isMasked
                ? { masked: true }
                : {
                      masked: false,
                      text: varsel.tekst ?? "",
                      link: varsel.link ?? "",
                  }),
        });

    return [
        ...(varsler.oppgaver.map(varselToNotification("task")) || []),
        ...(varsler.beskjeder.map(varselToNotification("message")) || []),
    ];
};

export const getNotifications = async ({ request }: { request: Request }) =>
    fetch(`${env.VARSEL_API_URL}/varselbjelle/varsler`, {
        headers: {
            cookie: request.headers.get("cookie") || "",
        },
    })
        .then((res) => res.json() as Promise<NotificationData>)
        .then(varslerToNotifications);
