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
] as PublicStorage[];

const localStorageMock = (function () {
    let store: { [key: string]: string } = {};

    return {
        getItem(key: string): string | null {
            return store[key] || null;
        },

        setItem(key: string, value: string): void {
            store[key] = value;
        },

        clear(): void {
            store = {};
        },

        removeItem(key: string): void {
            delete store[key];
        },

        getAll(): { [key: string]: string } {
            return store;
        },
    };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Tester webStorage", () => {
    beforeEach(() => {
        window.__DECORATOR_DATA__ = {
            allowedStorage: mockStorageDictionary,
        } as AppState;

        Cookies.set("usertest-1234", "foobar");
        Cookies.set("AMP_1234", "foobar");
        Cookies.set("selvbetjeningidtoken", "foobar");
        Cookies.set("ta-dekoratoren-1234", "foobar");
        Cookies.set("ukjent-cookie", "foobar");
    });
    it("Tester at kontrolleren sender event om å åpne cookie-banner ved manglende samtykke-handling", () => {
        const triggerEvent = vi.fn();
        window.addEventListener("showConsentBanner", triggerEvent);
        new WebStorageController();

        expect(triggerEvent).toHaveBeenCalled();
    });

    it("Tester at kjente frivillige cookies slettes når cookie-banner vises", async () => {
        expect(Cookies.get("usertest-1234")).toBe("foobar");
        expect(Cookies.get("AMP_1234")).toBe("foobar");
        expect(Cookies.get("selvbetjeningidtoken")).toBe("foobar");
        expect(Cookies.get("ta-dekoratoren-1234")).toBe("foobar");
        expect(Cookies.get("ukjent-cookie")).toBe("foobar");

        new WebStorageController();
        await new Promise((resolve) => setTimeout(resolve, 100));

        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(Cookies.get("selvbetjeningidtoken")).toBe("foobar");
        expect(Cookies.get("usertest-1234")).toBe(undefined);
        expect(Cookies.get("AMP_1234")).toBe(undefined);
        expect(Cookies.get("ta-dekoratoren-1234")).toBe(undefined);
        expect(Cookies.get("ukjent-cookie")).toBe("foobar");
    });
});
