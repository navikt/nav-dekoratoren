import { expect } from "@playwright/test";
import { test } from "./fixtures";

test("main menu", async ({ page }) => {
    await page.getByRole("button", { name: "Meny" }).click();
    await expect(page.getByText("Hva kan vi hjelpe deg med?")).toBeVisible();
});
