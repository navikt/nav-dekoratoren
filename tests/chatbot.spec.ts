import { expect } from "@playwright/test";
import { test } from "./fixtures";

test("chatbot", async ({ page }) => {
    await expect(page.getByTestId("chatbot-frida-knapp")).not.toBeVisible();
    await page.evaluate(() => {
        window.postMessage({
            source: "decoratorClient",
            event: "params",
            payload: {
                chatbotVisible: true,
            },
        });
    });
    await expect(page.getByTestId("chatbot-frida-knapp")).toBeVisible();
});
