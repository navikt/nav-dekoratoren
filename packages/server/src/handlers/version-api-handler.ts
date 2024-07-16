import { watch } from "fs";
import { env } from "../env/server";
import { Handler } from "hono";

const filename = `${process.cwd()}/version-authority/version-authority.json`;

const getAuthoritativeVersion = async () => {
    try {
        const file = await Bun.file(filename).json();
        return file.AUTHORITATIVE_VERSION_ID;
    } catch (e) {
        console.log("Error: ", e);
        return null;
    }
};

const watcher = watch(filename, (event, filename) => {
    console.log(`Watcher event for ${filename} - ${event}`);
    const currentAuthoritativeVersion = getAuthoritativeVersion();
    if (currentAuthoritativeVersion) {
        versionData.authoritativeVersion = currentAuthoritativeVersion;
    }
});

process.on("SIGINT", () => {
    console.log(`Closing watcher for ${filename}`);
    watcher.close();
});

const versionData = {
    localVersion: env.VERSION_ID,
    authoritativeVersion: await getAuthoritativeVersion(),
};

export const versionApiHandler: Handler = async ({ json }) => json(versionData);
