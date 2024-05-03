import { OpsMessage, Node } from "decorator-shared/types";
import { env } from "./env/server";
import { ResponseCache } from "decorator-shared/cache";

const TEN_SECONDS_MS = 10 * 1000;

const menuCache = new ResponseCache<Node[]>({ ttl: TEN_SECONDS_MS });
const opsMsgsCache = new ResponseCache<OpsMessage[]>({ ttl: TEN_SECONDS_MS });

// TODO: error handling and response validation

export const fetchMenu = async (): Promise<Node[]> => {
    const menu = await menuCache.get("menu", () =>
        fetch(`${env.ENONICXP_SERVICES}/no.nav.navno/menu`).then(
            (response) => response.json() as Promise<Node[]>,
        ),
    );

    return menu || [];
};

export const fetchOpsMessages = async (): Promise<OpsMessage[]> => {
    const msgs = await opsMsgsCache.get("opsMsgs", () =>
        fetch(`${env.ENONICXP_SERVICES}/no.nav.navno/driftsmeldinger`).then(
            (response) => response.json() as Promise<OpsMessage[]>,
        ),
    );

    return msgs || [];
};
