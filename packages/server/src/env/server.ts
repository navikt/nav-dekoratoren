import {
    clientEnvSchema,
    clientEnvWhitelist,
    type ClientEnvironment,
} from "decorator-shared/params";
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

export const serverEnv = parseEnv("server", serverSchema);

const parsedClientEnv = parseEnv("client", clientEnvSchema);

// Guard against clientEnv ever containing keys beyond clientEnvSchema
export const clientEnv: ClientEnvironment = Object.fromEntries(
    Object.entries(parsedClientEnv).filter(([key]) =>
        clientEnvWhitelist.includes(key as keyof ClientEnvironment),
    ),
) as ClientEnvironment;
