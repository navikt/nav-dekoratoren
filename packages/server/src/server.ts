import ContentService from "./content-service";
import menu from "./content-test-data.json";
import { fetchMenu } from "./enonic";
import { env } from "./env/server";
import setupMocks from "./mocks";
import requestHandler from "./request-handler";
import UnleashService from "./unleash-service";

console.log("Starting decorator-next server");

if (env.NODE_ENV === "development") {
    console.log("Setting up mocks");
    setupMocks();
}

const server = Bun.serve({
    port: 8089,
    development: env.NODE_ENV === "development",
    fetch: await requestHandler(
        new ContentService(
            process.env.NODE_ENV === "production"
                ? fetchMenu
                : () => Promise.resolve(menu),
        ),
        new UnleashService({}),
    ),
});

console.log(
    `decorator-next is running at http://${server.hostname}:${server.port}`,
);
