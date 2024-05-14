import { ResponseCache } from "decorator-shared/cache";
import { OpsMessage } from "decorator-shared/types";
import { env } from "./env/server";

const TEN_SECONDS_MS = 10 * 1000;

const opsMsgsCache = new ResponseCache<OpsMessage[]>({ ttl: TEN_SECONDS_MS });

// TODO: error handling and response validation
export const fetchOpsMessages = async (): Promise<OpsMessage[]> => {
    const msgs = await opsMsgsCache.get("opsMsgs", () =>
        fetch(`${env.ENONICXP_SERVICES}/no.nav.navno/driftsmeldinger`).then(
            (response) => response.json() as Promise<OpsMessage[]>,
        ),
    );

    return msgs || [];
};
