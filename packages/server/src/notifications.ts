import { z } from "zod";
import { env } from "./env/server";
import { Result, ResultType } from "./result";
import { fetchAndValidateJson } from "./lib/fetch-and-validate";

const varselSchema = z.object({
    eventId: z.string(),
    type: z.enum(["oppgave", "beskjed"]),
    tidspunkt: z.string(),
    isMasked: z.boolean(),
    tekst: z.string().nullable(),
    link: z.string().nullable(),
    eksternVarslingKanaler: z.array(z.string()),
});

const varslerSchema = z.object({
    oppgaver: z.array(varselSchema),
    beskjeder: z.array(varselSchema),
});

type Varsel = z.infer<typeof varselSchema>;

export type Varsler = z.infer<typeof varslerSchema>;

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

export const getNotifications = async ({
    cookie,
}: {
    cookie: string;
}): Promise<ResultType<Notification[]>> => {
    return fetchAndValidateJson(
        `${env.VARSEL_API_URL}/varselbjelle/varsler`,
        {
            headers: { cookie },
        },
        varslerSchema,
    ).then((result) => {
        console.log(result);
        return result.ok
            ? { ...result, data: varslerToNotifications(result.data) }
            : result;
    });
};

export const archiveNotification = async ({
    cookie,
    id,
}: {
    cookie: string;
    id: string;
}) => {
    const fetchResult = await fetch(`${env.VARSEL_API_URL}/beskjed/inaktiver`, {
        method: "POST",
        headers: {
            cookie,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId: id }),
    });

    if (!fetchResult.ok) {
        return Result.Error(await fetchResult.text());
    }

    return Result.Ok(id);
};
