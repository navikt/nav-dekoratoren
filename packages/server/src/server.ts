import { serve } from "@hono/node-server";
import { logger } from "./lib/logger";
import { app } from "./routes";
import { closeVersionApiWatcher } from "./handlers/version-api-handler";

const port = Number(process.env.PORT) || 8089;
serve({ fetch: app.fetch, port });
logger.info(`Server running on port ${port}`);

const shutdown = () => {
    closeVersionApiWatcher();
    process.exit(0);
};

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
