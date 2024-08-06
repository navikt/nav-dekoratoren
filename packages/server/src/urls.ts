import { env } from "./env/server";

export const buildCdnUrl = (src: string) => `${env.CDN_URL}/${src}`;

export const isLocalhost = () => env.APP_URL.includes("/localhost:");
