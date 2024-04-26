import { OpsMessage, Node } from "decorator-shared/types";
import { env } from "./env/server";

let cachedAt = 0;
let menuCache: Node[];

export const fetchMenu: () => Promise<Node[]> = async () => {
    if (cachedAt + 1000 * 60 * 5 < Date.now()) {
        cachedAt = Date.now();
        menuCache = (await fetch(
            `${env.ENONICXP_SERVICES}/no.nav.navno/menu`,
        ).then((response) => response.json())) as Node[];
    }
    return menuCache;
};

export const fetchOpsMessages = (): Promise<OpsMessage[]> => {
    const driftsmeldinger = fetch(
        `${env.ENONICXP_SERVICES}/no.nav.navno/driftsmeldinger`,
    ).then((res) => res.json()) as Promise<OpsMessage[]>;
    return driftsmeldinger;
};
