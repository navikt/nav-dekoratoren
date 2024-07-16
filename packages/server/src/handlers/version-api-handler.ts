import { env } from "../env/server";
import { Handler } from "hono";

const getVersionAuthority = () => {
    try {
        const file = Bun.file(
            `${process.cwd()}/version-authority/version-authority.json`,
        );

        return file?.json().AUTHORITATIVE_VERSION_ID;
    } catch (e) {
        return "Not found";
    }
};

export const versionApiHandler: Handler = async ({ json }) =>
    json({
        localVersion: env.VERSION_ID,
        authoritativeVersion: "", //await getVersionAuthority(),
    });
