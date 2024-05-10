import { describe, expect, test } from "bun:test";
import TaConfigService from "./task-analytics-service";
import { expectOK } from "./test-expect";

describe("task analytics", () => {
    test("returns config", async () => {
        const result = await new TaConfigService().getTaConfig();
        expectOK(result);
        expect(result.config.length).toBe(3);
        expect(result.config[2]).toEqual({
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

        expectOK(config1);
        expectOK(config2);
        expect(config1.config).toBe(config2.config);
    });
});
