import { watch } from "node:fs";
import { env } from "../env/server";
import { Handler } from "hono";

const filename = `${process.cwd()}/version-authority/version-authority.json`;

const getAuthoritativeVersion = async () => {
    try {
        const id = (await Bun.file(filename).json())?.AUTHORITATIVE_VERSION_ID;
        return typeof id === "string" ? id : null;
    } catch (e) {
        console.log(`Error reading file ${filename} - ${e}`);
        return null;
    }
};

try {
    const watcher = watch(filename, (event, filename) => {
        console.log(`Watcher event for ${filename} - ${event}`);
        getAuthoritativeVersion().then((result) => {
            if (result) {
                versionData.authoritativeVersion = result;
            }
        });
    });

    process.on("SIGINT", () => {
        console.log(`Closing watcher for file ${filename}`);
        watcher.close();
    });
} catch (e) {
    console.log(`Error watching file ${filename} - ${e}`);
}

const versionData = {
    localVersion: env.VERSION_ID,
    authoritativeVersion: await getAuthoritativeVersion(),
};

export const versionApiHandler: Handler = async ({ json }) => json(versionData);
