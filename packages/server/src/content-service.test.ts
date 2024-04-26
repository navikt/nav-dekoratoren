import { expect, test, describe } from "bun:test";
import testData from "./content-test-data.json";
import ContentService from "./content-service";

const contentService = new ContentService(
    () => Promise.resolve(testData),
    () => Promise.resolve([]),
);

describe("getSimpleFooterLinks", () => {
    test("returns norwegian", async () => {
        expect(
            (await contentService.getSimpleFooterLinks({ language: "nb" }))?.at(
                0,
            )?.content,
        ).toBe("Personvern og informasjonskapsler");
    });

    test("returns english", async () => {
        expect(
            (await contentService.getSimpleFooterLinks({ language: "en" }))?.at(
                0,
            )?.content,
        ).toBe("Privacy and cookies");
    });
});
