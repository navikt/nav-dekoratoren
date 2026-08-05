import { clientEnvSchema } from "decorator-shared/params";
import { serverSchema } from "./schema";
import { z } from "zod";
import { logger } from "decorator-shared/logger";

function parseEnv<T extends z.ZodType>(name: string, schema: T): z.infer<T> {
    const result = schema.safeParse(process.env);
    if (!result.success) {
        logger.error(`❌ Invalid ${name} environment variables:\n`, {
            error: z.prettifyError(result.error),
        });
        throw new Error(`Invalid ${name} environment variables`);
    }
    return result.data;
}

export const env = parseEnv("server", serverSchema);
export const clientEnv = parseEnv("client", clientEnvSchema);
