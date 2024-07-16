import { env } from "../env/server";
import { Handler } from "hono";

export const versionApiHandler: Handler = async ({ json }) =>
    json({
        localVersion: env.VERSION_ID,
        authoritativeVersion: (
            await Bun.file(
                `${process.cwd()}/version-authority/version-authority.json`,
            ).json()
        )?.AUTHORITATIVE_VERSION_ID,
    });
