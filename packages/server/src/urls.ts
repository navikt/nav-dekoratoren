import { serverEnv } from "./env/server";

export const buildCdnUrl = (src: string) => `${serverEnv.CDN_URL}/${src}`;

export const isLocalhost = () => serverEnv.APP_URL.includes("/localhost:");
