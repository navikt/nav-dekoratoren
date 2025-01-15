import Cookies from "js-cookie";
import { AppState, PublicStorage } from "decorator-shared/types";
import { WebStorageController } from "./webStorage";

const mockStorageDictionary: PublicStorage[] = [
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
        name: "ta-dekoratoren-*",
        type: "cookie",
        optional: true,
    },
    {
        name: "_hjSession*",
        type: "cookie",
        optional: true,
    },
] as PublicStorage[];

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
        Cookies.set("ta-dekoratoren-1234", "foobar");
        Cookies.set("ukjent-cookie", "foobar");

        window.localStorage.setItem("usertest-1234", "foobar");
        window.localStorage.setItem("ukjentdata", "foobar");

        window.sessionStorage.setItem("usertest-1234", "foobar");
        window.sessionStorage.setItem("ukjentdata", "foobar");
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
        expect(Cookies.get("ta-dekoratoren-1234")).toBe("foobar");

        new WebStorageController();
        await new Promise((resolve) => setTimeout(resolve, 100));

        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(Cookies.get("usertest-1234")).toBe(undefined);
        expect(Cookies.get("AMP_1234")).toBe(undefined);
        expect(Cookies.get("_hjSessionUser_118350")).toBe(undefined);
        expect(Cookies.get("amp_abcdef")).toBe(undefined);
        expect(Cookies.get("ta-dekoratoren-1234")).toBe(undefined);
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
});
