import { env } from "./env/server";
import { z } from "zod";

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

type Result<Data> = { ok: true; data: Data } | { ok: false; error: Error };

export const getNotifications = async ({
    request,
}: {
    request: Request;
}): Promise<Result<Notification[]>> => {
    const fetchResult = await fetch(
        `${env.VARSEL_API_URL}/varselbjelle/varsler`,
        {
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
        },
    );

    if (!fetchResult.ok) {
        return {
            ok: false,
            error: Error(await fetchResult.text()),
        };
    }

    try {
        const json = await fetchResult.json();

        const validationResult = varslerSchema.safeParse(json);
        if (!validationResult.success) {
            return {
                ok: false,
                error: validationResult.error,
            };
        }

        return {
            ok: true,
            data: varslerToNotifications(validationResult.data),
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                ok: false,
                error,
            };
        }
        throw error;
    }
};
