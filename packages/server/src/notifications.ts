import { z } from "zod";
import { env } from "./env/server";
import { Result, ResultType } from "./result";

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
    request,
}: {
    request: Request;
}): Promise<ResultType<Notification[]>> => {
    const fetchResult = await fetch(
        `${env.VARSEL_API_URL}/varselbjelle/varsler`,
        {
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
        },
    );

    if (!fetchResult.ok) {
        return Result.Error(await fetchResult.text());
    }

    try {
        const json = await fetchResult.json();

        const validationResult = varslerSchema.safeParse(json);
        if (!validationResult.success) {
            return Result.Error(validationResult.error);
        }

        return Result.Ok(varslerToNotifications(validationResult.data));
    } catch (error) {
        if (error instanceof Error) {
            return Result.Error(error);
        }
        throw error;
    }
};

export const archiveNotification = async ({
    request,
    id,
}: {
    request: Request;
    id: string;
}) => {
    const fetchResult = await fetch(`${env.VARSEL_API_URL}/beskjed/inaktiver`, {
        method: "POST",
        headers: {
            cookie: request.headers.get("cookie") || "",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
    });

    if (!fetchResult.ok) {
        return Result.Error(await fetchResult.text());
    }

    return Result.Ok(id);
};
