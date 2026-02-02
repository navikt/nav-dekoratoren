import { contextSchema, languageSchema } from "decorator-shared/params";
import { z } from "zod";
import { ConfigMapWatcher } from "./lib/config-map-watcher";

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

const configMapWatcher = new ConfigMapWatcher<TaskAnalyticsSurvey>({
    mountPath: "/config",
    filename: "ta-config.json",
    onUpdate: (fileContent) => {
        const validated = validateSurveys(fileContent);
        if (validated) {
            config.surveys = validated;
        }
    },
    shouldPoll: true,
});

const validateSurveys = (surveys: unknown) => {
    const result = configSchema.safeParse(surveys);

    if (!result.success) {
        console.error(
            `Failed to validate TA surveys - ${result.error.issues.map((error) => error.path).join("\n")}`,
        );
        return null;
    }

    return result.data;
};

const config: { surveys: TaskAnalyticsSurvey[] } = {
    surveys: validateSurveys(await configMapWatcher.getFileContent()) || [],
};

export const getTaskAnalyticsSurveys = (): TaskAnalyticsSurvey[] => {
    return config.surveys;
};
