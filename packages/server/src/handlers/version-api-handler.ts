import { env } from "../env/server";
import { Handler } from "hono";

const versionData = {
    localVersion: env.VERSION_ID, //
    latestVersion: env.VERSION_ID, // remove these after updating ndm + xp-frontend
    versionId: env.VERSION_ID,
    timestamp: env.DEPLOY_TIME,
} as const;

console.log(`Deploy time: ${env.DEPLOY_TIME}`);

export const versionApiHandler: Handler = async ({ json }) => json(versionData);
