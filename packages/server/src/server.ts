import { env } from "./env/server";
import setupMocks from "./mocks";
import requestHandler from "./request-handler";

console.log("Starting decorator-next server");

if (env.NODE_ENV === "development") {
    console.log("Setting up mocks");
    setupMocks();
}

const server = Bun.serve({
    port: 8089,
    development: env.NODE_ENV === "development",
    fetch: await requestHandler(),
});

console.log(
    `decorator-next is running at http://${server.hostname}:${server.port}`,
);
