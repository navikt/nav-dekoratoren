import { Texts } from "decorator-shared/types";
import { env } from "./env/server";
import { Notification } from "./views/notifications/notifications";

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

const parseNotifications: (
    texts: Texts,
    data: NotificationData | null,
) => Promise<Notification[]> = async (texts, data) => {
    const kanalerToMetadata = (kanaler: string[]) => {
        if (kanaler.includes("SMS") && kanaler.includes("EPOST")) {
            return texts.notified_SMS_and_EPOST;
        } else if (kanaler.includes("SMS")) {
            return texts.notified_SMS;
        } else if (kanaler.includes("EPOST")) {
            return texts.notified_EPOST;
        } else {
            return undefined;
        }
    };

    const oppgaveToNotifiction = (oppgave: Oppgave) => ({
        title: texts.task,
        text: oppgave.isMasked ? texts.masked_task_text : oppgave.tekst ?? "",
        date: oppgave.tidspunkt,
        icon: "task" as const,
        metadata: kanalerToMetadata(oppgave.eksternVarslingKanaler),
        isArchivable: false,
        link: oppgave.link ?? "",
        id: oppgave.eventId,
        amplitudeKomponent: "varsel-oppgave",
    });

    const beskjedToNotification = (beskjed: Beskjed) => ({
        title: texts.message,
        text: beskjed.isMasked
            ? texts.masked_message_text
            : beskjed.tekst ?? "",
        date: beskjed.tidspunkt,
        icon: "message" as const,
        metadata: kanalerToMetadata(beskjed.eksternVarslingKanaler),
        isArchivable: !beskjed.link,
        link: beskjed.link ?? "",
        id: beskjed.eventId,
        amplitudeKomponent: "varsel-beskjed",
    });

    return Promise.resolve([
        ...(data?.oppgaver.map(oppgaveToNotifiction) || []),
        ...(data?.beskjeder.map(beskjedToNotification) || []),
    ]);
};

export const getNotifications = async ({
    request,
    texts,
}: {
    request: Request;
    texts: Texts;
}) =>
    fetch(`${env.VARSEL_API_URL}/varselbjelle/varsler`, {
        headers: {
            cookie: request.headers.get("cookie") || "",
        },
    })
        .then((res) => res.json() as Promise<NotificationData | null>)
        .then((notifications) => parseNotifications(texts, notifications));
