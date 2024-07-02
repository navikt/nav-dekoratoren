import { expect } from "@playwright/test";
import { test } from "./fixtures";

test("chatbot", async ({ page }) => {
    await expect(page.getByLabel("Åpne chat")).not.toBeVisible();
    await page.evaluate(() => {
        window.postMessage({
            source: "decoratorClient",
            event: "params",
            payload: {
                chatbot: true,
                chatbotVisible: true,
            },
        });
    });
    await expect(page.getByLabel("Åpne chat")).toBeVisible();
});
