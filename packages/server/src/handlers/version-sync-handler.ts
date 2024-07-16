import { Handler } from "hono";
import * as os from "node:os";

const ELECTOR_PATH = process.env.ELECTOR_PATH;

export const versionSyncHandler: Handler = async ({ json }) => {
    console.log(`Elector path: ${ELECTOR_PATH} - Hostname: ${os.hostname()}`);

    const electorRes = await fetch(`http://${ELECTOR_PATH}`).then((res) =>
        res.json(),
    );

    return json({
        electorPath: ELECTOR_PATH,
        hostname: os.hostname(),
        electorResponse: electorRes,
    });
};
