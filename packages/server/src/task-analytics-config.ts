import { contextSchema, languageSchema } from "decorator-shared/params";
import { z } from "zod";
import { Result, ResultType } from "./result";
import { ResponseCache } from "decorator-shared/response-cache";

export type TaskAnalyticsSurvey = z.infer<typeof taSurveySchema>;
export type TaskAnalyticsUrlRule = z.infer<typeof taUrlRuleSchema>;

const taUrlRuleSchema = z.object({
    url: z.string(),
    match: z.enum(["exact", "startsWith"]),
    exclude: z.optional(z.boolean()),
});

const taSurveySchema = z.object({
    id: z.string(),
    selection: z.optional(z.number()),
    duration: z.optional(
        z.object({
            start: z.optional(z.string()),
            end: z.optional(z.string()),
        }),
    ),
    urls: z.optional(z.array(taUrlRuleSchema)),
    audience: z.optional(z.array(contextSchema)),
    language: z.optional(z.array(languageSchema)),
});

const configSchema = z.array(taSurveySchema);

const TEN_SECONDS_MS = 10 * 1000;

const cache = new ResponseCache<TaskAnalyticsSurvey[]>({
    ttl: TEN_SECONDS_MS,
});

export const getTaskAnalyticsConfig = async (): Promise<
    ResultType<TaskAnalyticsSurvey[]>
> =>
    cache
        .get("task-analytics-config", async () => {
            const json = await Bun.file(
                `${process.cwd()}/config/ta-config.json`,
            ).json();

            const result = configSchema.safeParse(json);

            if (!result.success) {
                throw result.error;
            }

            return result.data;
        })
        .then((config) =>
            config ? Result.Ok(config) : Result.Error("Failed to fetch config"),
        );
