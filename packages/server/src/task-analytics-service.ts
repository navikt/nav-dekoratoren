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

type Result<Payload> = ({ ok: true } & Payload) | { ok: false; error: Error };
const Result = {
    Error: <Payload>(error: Error | string): Result<Payload> => ({
        ok: false,
        error: error instanceof Error ? error : new Error(error),
    }),
    Ok: (
        config: TaskAnalyticsSurveyConfig[],
    ): Result<{ config: TaskAnalyticsSurveyConfig[] }> => ({
        ok: true,
        config,
    }),
};

export default class TaConfigService {
    private readonly cache: Cache = {
        config: [],
        expires: 0,
    };

    async getTaConfig(): Promise<
        Result<{ config: TaskAnalyticsSurveyConfig[] }>
    > {
        if (Date.now() < this.cache.expires) {
            return Result.Ok(this.cache.config);
        }

        try {
            const fileContent = Bun.file(filePath);

            const json = await fileContent.json();
            if (!Array.isArray(json)) {
                console.error(
                    `Invalid TA config type - expected array, got ${typeof json}`,
                );
                return Result.Error(
                    new Error(
                        "Invalid TA config type - expected array, got " +
                            typeof json,
                    ),
                );
            }

            const config = json.filter(this.validateConfig);

            this.cache.config = config;
            this.cache.expires = Date.now() + CACHE_TTL_MS;

            return Result.Ok(config);
        } catch (e) {
            console.error(`Error loading TA config from ${filePath} - ${e}`);
            return Result.Error(
                `Error loading TA config from ${filePath} - ${e}`,
            );
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
