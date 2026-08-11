import { fixture } from "@open-wc/testing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "../helpers/logger";
import {
    decoratorApiMock,
    resetDecoratorApiMock,
    setDecoratorData,
} from "../helpers/api.testUtils";
import "./notifications";

vi.mock("../helpers/api", async () => {
    const mock = await import("../helpers/api.testUtils");
    return {
        decoratorApi: mock.decoratorApiMock,
        decoratorParams: mock.decoratorParamsMock,
    };
});

vi.mock("../analytics/analytics", () => ({
    logAnalyticsEvent: vi.fn(),
}));

describe("ArchivableNotification", () => {
    beforeEach(() => {
        resetDecoratorApiMock();
        setDecoratorData();
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it("archives the notification and removes it on click", async () => {
        decoratorApiMock.mockResolvedValue(undefined);
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
        expect(decoratorApiMock).toHaveBeenCalledWith(
            "/api/notifications/123/archive",
            {
                query: { mocked: true },
                method: "POST",
                credentials: "include",
            },
        );
    });

    it("logs and keeps the notification when archiving fails", async () => {
        const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
        decoratorApiMock.mockRejectedValue(new Error("boom"));
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
        resetDecoratorApiMock();
        setDecoratorData();
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it("archives a message notification without retries on click", async () => {
        decoratorApiMock.mockResolvedValue(undefined);
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
        expect(decoratorApiMock).toHaveBeenCalledWith(
            "/api/notifications/123/archive",
            {
                query: { mocked: true },
                method: "POST",
                credentials: "include",
                keepalive: true,
            },
        );
    });

    it("logs and keeps the notification when archiving fails", async () => {
        const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
        decoratorApiMock.mockRejectedValue(new Error("boom"));
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
        await Promise.resolve();
        await Promise.resolve();

        expect(decoratorApiMock).not.toHaveBeenCalled();
    });
});
