import Cookies from "js-cookie";
import { PublicStorageItem } from "decorator-shared/types";
import { WebStorageController } from "./webStorage";
import { logger } from "./helpers/logger";
import { http, setDecoratorData, waitFor } from "./test-setup";

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

/**
 * The controller clears cookies, localStorage, and sessionStorage in one
 * synchronous pass, a few microtask hops after construction. For the
 * "slettes ikke"-tests, waiting on the surviving item would pass before the
 * pass has even run — so wait for a sentinel the pass always deletes; once
 * it's gone, everything still present survived for real.
 */
const waitForClearingPass = () =>
    waitFor(() =>
        expect(window.sessionStorage.getItem("usertest-1234")).toBe(null),
    );

describe("Tester webStorage", () => {
    const controllers: WebStorageController[] = [];

    // Instances register listeners on window/document in their constructor.
    // Track them so every test tears its own down instead of stacking
    // listeners across the suite.
    const createController = () => {
        const controller = new WebStorageController();
        controllers.push(controller);
        return controller;
    };

    beforeEach(() => {
        setDecoratorData({
            allowedStorage: mockStorageDictionary,
        } as never);

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

        http.post("/api/consentping", { status: 204 });
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    afterEach(() => {
        controllers.forEach((controller) => controller.destroy());
        controllers.length = 0;
    });

    it("kontrolleren sender event om å åpne cookie-banner ved manglende samtykke-handling", () => {
        const triggerEvent = vi.fn();
        const listenerController = new AbortController();
        window.addEventListener("showConsentBanner", triggerEvent, {
            signal: listenerController.signal,
        });
        createController();

        expect(triggerEvent).toHaveBeenCalled();

        listenerController.abort();
    });

    it("kjente frivillige cookies slettes når cookie-banner vises", async () => {
        expect(Cookies.get("usertest-1234")).toBe("foobar");
        expect(Cookies.get("AMP_1234")).toBe("foobar");
        expect(Cookies.get("_hjSessionUser_118350")).toBe("foobar");
        expect(Cookies.get("amp_abcdef")).toBe("foobar");

        createController();

        await waitFor(() => {
            expect(Cookies.get("usertest-1234")).toBe(undefined);
            expect(Cookies.get("AMP_1234")).toBe(undefined);
            expect(Cookies.get("_hjSessionUser_118350")).toBe(undefined);
            expect(Cookies.get("amp_abcdef")).toBe(undefined);
        });
    });
    it("kjente nødvendige cookies slettes ikke når cookie-banner vises", async () => {
        expect(Cookies.get("selvbetjening-idtoken")).toBe("foobar");

        createController();
        await waitForClearingPass();

        expect(Cookies.get("selvbetjening-idtoken")).toBe("foobar");
    });

    it("ukjente cookies slettes ikke når cookie-banner vises", async () => {
        expect(Cookies.get("ukjent-cookie")).toBe("foobar");

        createController();
        await waitForClearingPass();

        expect(Cookies.get("ukjent-cookie")).toBe("foobar");
    });

    it("kjente frivillige localStorage-elementer slettes når cookie-banner vises", async () => {
        expect(window.localStorage.getItem("usertest-1234")).toBe("foobar");

        createController();

        await waitFor(() =>
            expect(window.localStorage.getItem("usertest-1234")).toBe(null),
        );
    });
    it("ukjente localStorage-elementer slettes ikke når cookie-banner vises", async () => {
        expect(window.localStorage.getItem("ukjentdata")).toBe("foobar");

        createController();
        await waitForClearingPass();

        expect(window.localStorage.getItem("ukjentdata")).toBe("foobar");
    });
    it("kjente frivillige sessionStorage-elementer slettes når cookie-banner vises", async () => {
        expect(window.sessionStorage.getItem("usertest-1234")).toBe("foobar");

        createController();

        await waitFor(() =>
            expect(window.sessionStorage.getItem("usertest-1234")).toBe(null),
        );
    });
    it("ukjente sessionStorage-elementer slettes ikke når cookie-banner vises", async () => {
        expect(window.sessionStorage.getItem("ukjentdata")).toBe("foobar");

        createController();
        await waitForClearingPass();

        expect(window.sessionStorage.getItem("ukjentdata")).toBe("foobar");
    });

    it("samtykke sendes til consentping-endepunktet", async () => {
        createController();

        window.dispatchEvent(new CustomEvent("consentAllWebStorage"));

        await http.settled();
        const call = http.lastCall!;
        expect(call.pathname).toBe("/api/consentping");
        expect(call.method).toBe("POST");
        expect(call.init.credentials).toBe("omit");

        // The body was already a JSON string in production code; the mock
        // hands it back parsed instead of via mock.calls spelunking.
        expect(call.json()).toEqual(
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
        http.post("/api/consentping", { status: 400 });
        createController();

        window.dispatchEvent(new CustomEvent("consentAllWebStorage"));

        await waitFor(() => expect(errorSpy).toHaveBeenCalled());
        expect(errorSpy).toHaveBeenCalledWith(
            "Failed to send consent ping",
            expect.objectContaining({ error: expect.any(Error) }),
        );
        expect(Cookies.get("navno-consent")).toBeDefined();
    });
});
