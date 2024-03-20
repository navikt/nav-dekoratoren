import { TaskAnalyticsSurveyConfig } from 'decorator-shared/types';
import { z } from 'zod';
import { contextSchema, languageSchema } from 'decorator-shared/params';

// To mock this locally, create the file /config/ta-config-mock.json on the project root
const filePath = Bun.resolveSync('./config/ta-config.json', process.cwd());

const configSchema = z.object({
    id: z.string(),
    selection: z.optional(z.number()),
    duration: z.optional(
        z.object({
            start: z.optional(z.string()),
            end: z.optional(z.string()),
        })
    ),
    urls: z.optional(
        z.array(
            z.object({
                url: z.string(),
                match: z.enum(['exact', 'startsWith']),
                exclude: z.optional(z.boolean()),
            })
        )
    ),
    audience: z.optional(z.array(contextSchema)),
    language: z.optional(z.array(languageSchema)),
});

type ConfigSchema = z.infer<typeof configSchema>;

export default class TaConfigService {
    async getTaConfig(): Promise<TaskAnalyticsSurveyConfig[]> {
        try {
            console.log(`Attempting to load TA config from ${filePath}`);

            const fileContent = Bun.file(filePath);

            const json = await fileContent.json();
            if (!Array.isArray(json)) {
                console.error(`Invalid TA config type - expected array, got ${typeof json}`);
                return [];
            }

            return json.filter(this.validateConfig);
        } catch (e) {
            console.error(`Error loading TA config: ${e}`);
            return [];
        }
    }

    private validateConfig(config: unknown): config is ConfigSchema {
        const result = configSchema.safeParse(config);

        if (!result.success) {
            console.error(`Validation error for TA config - ${result.error.message}`);
            return false;
        }

        return true;
    }
}
