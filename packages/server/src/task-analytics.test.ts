import { describe, expect, test } from "bun:test";
import TaConfigService from "./task-analytics-service";

describe("task analytics", () => {
    test("returns config", async () => {
        const config = await new TaConfigService().getTaConfig();
        expect(config.length).toBe(3);
        expect(config[2]).toEqual({
            duration: {
                end: "2023-02-28",
                start: "2023-01-30T08:00",
            },
            id: "2357",
            urls: [
                {
                    match: "startsWith",
                    url: "https://www.dev.nav.no/soknader",
                },
            ],
        });
    });

    test("caches config", async () => {
        const service = new TaConfigService();
        const config1 = await service.getTaConfig();
        const config2 = await service.getTaConfig();

        expect(config1).toBe(config2);
    });
});
