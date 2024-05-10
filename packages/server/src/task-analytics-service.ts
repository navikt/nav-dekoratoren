import { contextSchema, languageSchema } from "decorator-shared/params";
import { z } from "zod";

const configSchema = z.array(
    z.object({
        id: z.string(),
        selection: z.optional(z.number()),
        duration: z.optional(
            z.object({
                start: z.optional(z.string()),
                end: z.optional(z.string()),
            }),
        ),
        urls: z.optional(
            z.array(
                z.object({
                    url: z.string(),
                    match: z.enum(["exact", "startsWith"]),
                    exclude: z.optional(z.boolean()),
                }),
            ),
        ),
        audience: z.optional(z.array(contextSchema)),
        language: z.optional(z.array(languageSchema)),
    }),
);

type TaskAnalyticsSurveyConfig = z.infer<typeof configSchema>;

type Result<Payload> = ({ ok: true } & Payload) | { ok: false; error: Error };

const Result = {
    Error: <Payload>(error: Error | string): Result<Payload> => ({
        ok: false,
        error: error instanceof Error ? error : new Error(error),
    }),
    Ok: <Payload>(payload: Payload): Result<Payload> => ({
        ok: true,
        ...payload,
    }),
};

let cache: TaskAnalyticsSurveyConfig;
let expires: number;

export const getTaConfig = async (): Promise<
    Result<{ config: TaskAnalyticsSurveyConfig }>
> => {
    if (Date.now() < expires) {
        return Result.Ok({ config: cache });
    }

    try {
        const json = await Bun.file(
            `${process.cwd()}/config/ta-config.json`,
        ).json();

        const result = configSchema.safeParse(json);

        if (!result.success) {
            return Result.Error(result.error);
        }

        cache = result.data;
        expires = Date.now() + 10000;

        return Result.Ok({ config: result.data });
    } catch (e) {
        if (e instanceof Error) {
            return Result.Error(e);
        }
        throw e;
    }
};
