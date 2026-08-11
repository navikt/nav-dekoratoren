import Cookies from "js-cookie";
import { AppState, PublicStorageItem } from "decorator-shared/types";
import { WebStorageController } from "./webStorage";
import { logger } from "./helpers/logger";
import {
    decoratorApiMock,
    resetDecoratorApiMock,
} from "./helpers/api.testUtils";

vi.mock("./helpers/api", async () => {
    const mock = await import("./helpers/api.testUtils");
    return {
        decoratorApi: mock.decoratorApiMock,
        decoratorParams: mock.decoratorParamsMock,
    };
});

const mockStorageDictionary: PublicStorageItem[] = [
    {
        name: "selvbetjening-idtoken",
        type: "cookie",
        optional: false,
    },
    {
        name: "usertest-*",
        optional: true,
        type: "cookie",
    },
    {
        name: "AMP_*",
        type: "cookie",
        optional: true,
    },
    {
        name: "_hjSession*",
        type: "cookie",
        optional: true,
    },
] as PublicStorageItem[];

describe("Tester webStorage", () => {
    beforeEach(() => {
        window.__DECORATOR_DATA__ = {
            allowedStorage: mockStorageDictionary,
        } as AppState;

        Cookies.set("usertest-1234", "foobar");
        Cookies.set("AMP_1234", "foobar");
        Cookies.set("_hjSessionUser_118350", "foobar");
        Cookies.set("amp_abcdef", "foobar");
        Cookies.set("selvbetjening-idtoken", "foobar");
        Cookies.set("ukjent-cookie", "foobar");

        window.localStorage.setItem("usertest-1234", "foobar");
        window.localStorage.setItem("ukjentdata", "foobar");

        window.sessionStorage.setItem("usertest-1234", "foobar");
        window.sessionStorage.setItem("ukjentdata", "foobar");

        resetDecoratorApiMock();
        decoratorApiMock.mockResolvedValue(undefined);
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });
    it("kontrolleren sender event om å åpne cookie-banner ved manglende samtykke-handling", () => {
        const triggerEvent = vi.fn();
        window.addEventListener("showConsentBanner", triggerEvent);
        new WebStorageController();

        expect(triggerEvent).toHaveBeenCalled();
    });

    it("kjente frivillige cookies slettes når cookie-banner vises", async () => {
        expect(Cookies.get("usertest-1234")).toBe("foobar");
        expect(Cookies.get("AMP_1234")).toBe("foobar");
        expect(Cookies.get("_hjSessionUser_118350")).toBe("foobar");
        expect(Cookies.get("amp_abcdef")).toBe("foobar");

        new WebStorageController();
        await new Promise((resolve) => setTimeout(resolve, 100));

        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(Cookies.get("usertest-1234")).toBe(undefined);
        expect(Cookies.get("AMP_1234")).toBe(undefined);
        expect(Cookies.get("_hjSessionUser_118350")).toBe(undefined);
        expect(Cookies.get("amp_abcdef")).toBe(undefined);
    });
    it("kjente nødvendige cookies slettes ikkenår cookie-banner vises", async () => {
        expect(Cookies.get("selvbetjening-idtoken")).toBe("foobar");

        new WebStorageController();
        await new Promise((resolve) => setTimeout(resolve, 100));

        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(Cookies.get("selvbetjening-idtoken")).toBe("foobar");
    });

    it("ukjente cookies slettes ikke når cookie-banner vises", async () => {
        expect(Cookies.get("ukjent-cookie")).toBe("foobar");

        new WebStorageController();
        await new Promise((resolve) => setTimeout(resolve, 100));

        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(Cookies.get("ukjent-cookie")).toBe("foobar");
    });

    it("kjente frivillige localStorage-elementer slettes når cookie-banner vises", async () => {
        expect(window.localStorage.getItem("usertest-1234")).toBe("foobar");

        new WebStorageController();
        await new Promise((resolve) => setTimeout(resolve, 100));

        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(window.localStorage.getItem("usertest-1234")).toBe(null);
    });
    it("ukjente localStorage-elementer slettes ikke når cookie-banner vises", async () => {
        expect(window.localStorage.getItem("ukjentdata")).toBe("foobar");

        new WebStorageController();
        await new Promise((resolve) => setTimeout(resolve, 100));

        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(window.localStorage.getItem("ukjentdata")).toBe("foobar");
    });
    it("kjente frivillige sessionStorage-elementer slettes når cookie-banner vises", async () => {
        expect(window.sessionStorage.getItem("usertest-1234")).toBe("foobar");

        new WebStorageController();
        await new Promise((resolve) => setTimeout(resolve, 100));

        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(window.sessionStorage.getItem("usertest-1234")).toBe(null);
    });
    it("ukjente sessionStorage-elementer slettes ikke når cookie-banner vises", async () => {
        expect(window.sessionStorage.getItem("ukjentdata")).toBe("foobar");

        new WebStorageController();
        await new Promise((resolve) => setTimeout(resolve, 100));

        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(window.sessionStorage.getItem("ukjentdata")).toBe("foobar");
    });

    it("samtykke sendes til consentping-endepunktet", async () => {
        new WebStorageController();

        window.dispatchEvent(new CustomEvent("consentAllWebStorage"));

        await vi.waitFor(() => expect(decoratorApiMock).toHaveBeenCalled());
        expect(decoratorApiMock).toHaveBeenCalledWith("/api/consentping", {
            method: "POST",
            credentials: "omit",
            body: expect.any(String),
        });

        const [, options] = decoratorApiMock.mock.calls[0];
        expect(JSON.parse(options.body)).toEqual(
            expect.objectContaining({
                consentObject: expect.objectContaining({
                    consent: { analytics: true, surveys: true },
                    userActionTaken: true,
                }),
                originUrl: expect.objectContaining({
                    redactedUrl: expect.any(String),
                }),
            }),
        );
    });

    it("samtykke lagres selv om consentping feiler", async () => {
        const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
        decoratorApiMock.mockRejectedValue(new Error("boom"));
        new WebStorageController();

        window.dispatchEvent(new CustomEvent("consentAllWebStorage"));

        await vi.waitFor(() => expect(errorSpy).toHaveBeenCalled());
        expect(errorSpy).toHaveBeenCalledWith(
            "Failed to send consent ping",
            expect.objectContaining({ error: expect.any(Error) }),
        );
        expect(Cookies.get("navno-consent")).toBeDefined();
    });
});
