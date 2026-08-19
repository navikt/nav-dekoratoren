import { fixture } from "@open-wc/testing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OpsMessage } from "decorator-shared/types";
import { logger } from "../helpers/logger";
import { http, setDecoratorData } from "../test-setup";
import "./ops-messages";

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
        setDecoratorData({
            texts: { important_info: "Viktig informasjon" },
        } as never);
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it("fetches and renders ops messages on connect", async () => {
        http.get("/ops-messages", { json: [opsMessage()] });

        const el = await fixture("<ops-messages></ops-messages>");

        await vi.waitFor(() => expect(el.innerHTML).toContain("Driftsmelding"));
        expect(http.lastCall?.pathname).toBe("/ops-messages");
        expect(el.getAttribute("aria-label")).toBe("Viktig informasjon");
    });

    it("renders nothing when there are no messages", async () => {
        http.get("/ops-messages", { json: [] });

        const el = await fixture("<ops-messages>old</ops-messages>");

        await vi.waitFor(() => expect(el.innerHTML).toBe(""));
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    it("logs and renders nothing when the fetch fails", async () => {
        const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
        // 400 is non-retryable, so the module-scope retry: 2 client fails fast.
        http.get("/ops-messages", { status: 400 });

        const el = await fixture("<ops-messages></ops-messages>");

        await vi.waitFor(() => expect(errorSpy).toHaveBeenCalled());
        expect(errorSpy).toHaveBeenCalledWith(
            "Failed to fetch ops-messages",
            expect.objectContaining({ error: expect.any(Error) }),
        );
        expect(el.innerHTML).toBe("");
    });
});
