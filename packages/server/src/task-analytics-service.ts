import { TaskAnalyticsSurveyConfig } from "decorator-shared/types";
import { z } from "zod";
import { contextSchema, languageSchema } from "decorator-shared/params";

// To mock this locally, create the file /config/ta-config.json on the server package root
const filePath = `${process.cwd()}/config/ta-config.json`;

const configSchema = z.object({
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
});

type ConfigSchema = z.infer<typeof configSchema>;

type Cache = {
    config: TaskAnalyticsSurveyConfig[];
    expires: number;
};

const CACHE_TTL_MS = 10000;

export default class TaConfigService {
    private readonly cache: Cache = {
        config: [],
        expires: 0,
    };

    async getTaConfig(): Promise<TaskAnalyticsSurveyConfig[]> {
        if (Date.now() < this.cache.expires) {
            return this.cache.config;
        }

        try {
            const fileContent = Bun.file(filePath);

            const json = await fileContent.json();
            if (!Array.isArray(json)) {
                console.error(
                    `Invalid TA config type - expected array, got ${typeof json}`,
                );
                return [];
            }

            const config = json.filter(this.validateConfig);

            this.cache.config = config;
            this.cache.expires = Date.now() + CACHE_TTL_MS;

            return config;
        } catch (e) {
            console.error(`Error loading TA config from ${filePath} - ${e}`);
            return [];
        }
    }

    private validateConfig(config: unknown): config is ConfigSchema {
        const result = configSchema.safeParse(config);

        if (!result.success) {
            console.error(
                `Validation error for TA config - ${result.error.message}`,
            );
            return false;
        }

        return true;
    }
}
