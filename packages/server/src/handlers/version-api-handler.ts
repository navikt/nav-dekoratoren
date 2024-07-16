import { env } from "../env/server";
import { Handler } from "hono";

const getVersionAuthority = async () => {
    try {
        const file = await Bun.file(
            `${process.cwd()}/version-authority/version-authority.json`,
        ).json();

        return file.AUTHORITATIVE_VERSION_ID;
    } catch (e) {
        console.log("Error: ", e);
        return "Not found";
    }
};

export const versionApiHandler: Handler = async ({ json }) =>
    json({
        localVersion: env.VERSION_ID,
        authoritativeVersion: await getVersionAuthority(),
    });
