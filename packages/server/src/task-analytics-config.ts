import { contextSchema, languageSchema } from "decorator-shared/params";
import { z } from "zod";
import { Result, ResultType } from "./result";
import { StaleWhileRevalidateResponseCache } from "./lib/response-cache";

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

const TEN_SECONDS_MS = 10 * 1000;

const cache = new StaleWhileRevalidateResponseCache<TaskAnalyticsSurveyConfig>({
    ttl: TEN_SECONDS_MS,
});

export const getTaskAnalyticsConfig = async (): Promise<
    ResultType<TaskAnalyticsSurveyConfig>
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
