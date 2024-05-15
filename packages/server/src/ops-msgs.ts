import { StaleWhileRevalidateResponseCache } from "decorator-shared/response-cache";
import { OpsMessage } from "decorator-shared/types";
import { env } from "./env/server";

const TEN_SECONDS_MS = 10 * 1000;

const DRIFTSMELDINGER_SERVICE_URL = `${env.ENONICXP_SERVICES}/no.nav.navno/driftsmeldinger`;

const opsMsgsCache = new StaleWhileRevalidateResponseCache<OpsMessage[]>({
    ttl: TEN_SECONDS_MS,
});

// TODO: error handling and response validation
export const fetchOpsMessages = async (): Promise<OpsMessage[]> => {
    const msgs = await opsMsgsCache.get("opsMsgs", () =>
        fetch(DRIFTSMELDINGER_SERVICE_URL).then(
            (response) => response.json() as Promise<OpsMessage[]>,
        ),
    );

    return msgs || [];
};
