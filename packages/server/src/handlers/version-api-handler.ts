import { env } from "../env/server";
import { Handler } from "hono";
import { ConfigMapWatcher } from "../lib/config-map-watcher";

type ConfigMapType = {
    AUTHORITATIVE_VERSION_ID: string;
};

const configMapWatcher = new ConfigMapWatcher<ConfigMapType>({
    mountPath: "/version-authority",
    filename: "version-authority.json",
    onUpdate: (fileContent) => {
        versionData.authoritativeVersion =
            fileContent?.AUTHORITATIVE_VERSION_ID;
    },
});

const getAuthoritativeVersion = async () => {
    return configMapWatcher
        .getFileContent()
        .then((fileContent) => fileContent?.AUTHORITATIVE_VERSION_ID);
};

const versionData = {
    localVersion: env.VERSION_ID,
    authoritativeVersion: await getAuthoritativeVersion(),
};

export const versionApiHandler: Handler = async ({ json }) => json(versionData);
