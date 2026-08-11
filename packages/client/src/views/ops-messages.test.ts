import { fixture } from "@open-wc/testing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OpsMessage } from "decorator-shared/types";
import { logger } from "../helpers/logger";
import {
    decoratorApiMock,
    resetDecoratorApiMock,
    setDecoratorData,
} from "../helpers/api.testUtils";
import "./ops-messages";

vi.mock("../helpers/api", async () => {
    const mock = await import("../helpers/api.testUtils");
    return {
        decoratorApi: mock.decoratorApiMock,
        decoratorParams: mock.decoratorParamsMock,
    };
});

const opsMessage = (overrides: Partial<OpsMessage> = {}): OpsMessage =>
    ({
        heading: "Driftsmelding",
        url: "https://www.nav.no/driftsmelding",
        type: "prodstatus",
        urlscope: [],
        ...overrides,
    }) as OpsMessage;

describe("OpsMessages", () => {
    beforeEach(() => {
        resetDecoratorApiMock();
        setDecoratorData({
            texts: { important_info: "Viktig informasjon" },
        } as never);
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it("fetches and renders ops messages on connect", async () => {
        decoratorApiMock.get.mockResolvedValue([opsMessage()]);

        const el = await fixture("<ops-messages></ops-messages>");

        await vi.waitFor(() => expect(el.innerHTML).toContain("Driftsmelding"));
        expect(decoratorApiMock.get).toHaveBeenCalledWith("/ops-messages", {
            query: { mocked: true },
        });
        expect(el.getAttribute("aria-label")).toBe("Viktig informasjon");
    });

    it("renders nothing when there are no messages", async () => {
        decoratorApiMock.get.mockResolvedValue([]);

        const el = await fixture("<ops-messages>old</ops-messages>");

        await vi.waitFor(() => expect(el.innerHTML).toBe(""));
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    it("logs and renders nothing when the fetch fails", async () => {
        const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
        decoratorApiMock.get.mockRejectedValue(new Error("boom"));

        const el = await fixture("<ops-messages></ops-messages>");

        await vi.waitFor(() => expect(errorSpy).toHaveBeenCalled());
        expect(errorSpy).toHaveBeenCalledWith(
            "Failed to fetch ops-messages",
            expect.objectContaining({ error: expect.any(Error) }),
        );
        expect(el.innerHTML).toBe("");
    });
});
