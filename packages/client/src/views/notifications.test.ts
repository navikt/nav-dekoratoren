import { fixture } from "@open-wc/testing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "../helpers/logger";
import { http, setDecoratorData } from "../test-setup";
import "./notifications";

vi.mock("../analytics/analytics", () => ({
    logAnalyticsEvent: vi.fn(),
}));

const ARCHIVE_URL = /\/api\/notifications\/[^/]+\/archive\b/;

describe("ArchivableNotification", () => {
    beforeEach(() => {
        setDecoratorData();
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it("archives the notification and removes it on click", async () => {
        http.post(ARCHIVE_URL, { status: 204 });
        const wrapper = await fixture(`
            <div>
                <div class="wrapper">
                    <archivable-notification data-id="123">
                        <button></button>
                    </archivable-notification>
                </div>
            </div>
        `);

        wrapper.querySelector("button")!.click();

        await vi.waitFor(() =>
            expect(wrapper.querySelector("archivable-notification")).toBeNull(),
        );
        expect(http.lastCall?.pathname).toBe("/api/notifications/123/archive");
        expect(http.lastCall?.method).toBe("POST");
        expect(http.lastCall?.init.credentials).toBe("include");
    });

    it("logs and keeps the notification when archiving fails", async () => {
        const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
        http.post(ARCHIVE_URL, { status: 400 });
        const wrapper = await fixture(`
            <div>
                <div class="wrapper">
                    <archivable-notification data-id="123">
                        <button></button>
                    </archivable-notification>
                </div>
            </div>
        `);

        wrapper.querySelector("button")!.click();

        await vi.waitFor(() => expect(errorSpy).toHaveBeenCalled());
        expect(errorSpy).toHaveBeenCalledWith(
            "Failed to archive notifications from button",
            expect.objectContaining({ error: expect.any(Error) }),
        );
        expect(wrapper.querySelector("archivable-notification")).not.toBeNull();
    });
});

describe("LinkNotification", () => {
    beforeEach(() => {
        setDecoratorData();
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it("archives a message notification on click", async () => {
        http.post(ARCHIVE_URL, { status: 204 });
        const wrapper = await fixture(`
            <div>
                <div class="wrapper">
                    <link-notification data-id="123" data-type="message">
                        <a href="#beskjed"></a>
                    </link-notification>
                </div>
            </div>
        `);

        wrapper.querySelector("a")!.click();

        await vi.waitFor(() =>
            expect(wrapper.querySelector("link-notification")).toBeNull(),
        );
        expect(http.lastCall?.pathname).toBe("/api/notifications/123/archive");
        expect(http.lastCall?.method).toBe("POST");
        expect(http.lastCall?.init.credentials).toBe("include");
        // The link variant fires on navigation, so the request must survive it.
        expect(http.lastCall?.init.keepalive).toBe(true);
    });

    it("logs and keeps the notification when archiving fails", async () => {
        const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
        http.post(ARCHIVE_URL, { status: 400 });
        const wrapper = await fixture(`
            <div>
                <div class="wrapper">
                    <link-notification data-id="123" data-type="message">
                        <a href="#beskjed"></a>
                    </link-notification>
                </div>
            </div>
        `);

        wrapper.querySelector("a")!.click();

        await vi.waitFor(() => expect(errorSpy).toHaveBeenCalled());
        expect(errorSpy).toHaveBeenCalledWith(
            "Failed to archive notifications from link",
            expect.objectContaining({ error: expect.any(Error) }),
        );
        expect(wrapper.querySelector("link-notification")).not.toBeNull();
    });

    it("does not archive inbox notifications", async () => {
        const wrapper = await fixture(`
            <div>
                <div class="wrapper">
                    <link-notification data-id="123" data-type="inbox">
                        <a href="#innboks"></a>
                    </link-notification>
                </div>
            </div>
        `);

        wrapper.querySelector("a")!.click();
        await http.settled();

        expect(http.calls).toHaveLength(0);
    });
});
