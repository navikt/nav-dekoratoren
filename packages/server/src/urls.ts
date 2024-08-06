import { env } from "./env/server";

export const buildCdnUrl = (src: string) => {
    console.log(env.CDN_URL, src);
    return `${env.CDN_URL}/${src}`;
};

export const isLocalhost = () =>
    env.APP_URL.includes("/localhost:") ||
    env.APP_URL.includes("/bs-local.com:");
