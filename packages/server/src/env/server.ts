import { clientEnvSchema } from "decorator-shared/params";
import { serverSchema, serverEnv, client_env } from "./schema";
import { logger } from "../lib/logger";

const _serverEnv = serverSchema.safeParse(serverEnv);
const _clientEnv = clientEnvSchema.safeParse(client_env);

if (!_serverEnv.success) {
    logger.error("❌ Invalid server environment variables:\n", {
        errors: _serverEnv.error.errors.map((error) => error.path).join("\n"),
    });
    throw new Error("Invalid server environment variables");
}

if (!_clientEnv.success) {
    logger.error("❌ Invalid client environment variables:\n", {
        errors: _clientEnv.error.errors.map((error) => error.path).join("\n"),
    });
    throw new Error("Invalid client environment variables");
}

// As to not leak important things
export const env = { ..._serverEnv.data };
export const clientEnv = {
    ..._clientEnv.data,
};
