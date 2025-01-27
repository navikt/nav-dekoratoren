import Cookies from "js-cookie";
import { createEvent } from "./events";
import {
    ConsentAction,
    Consent,
    PublicStorageItem,
} from "decorator-shared/types";
import { isProd } from "./helpers/env";

const DECORATOR_DATA_TIMEOUT = 5000;

export class WebStorageController {
    currentConsentVersion: number = 1;
    consentKey: string = "navno-consent";

    constructor() {
        this.initEventListeners();
        this.checkAndTriggerConsentBanner();

        console.log("WebStorageController initialized");
    }

    // Default consent object ensures that nothing is allowed until user has
    // given and explicit consent.
    private buildDefaultConsent = () => {
        return {
            consent: {
                analytics: false,
                surveys: false,
            },
            userActionTaken: false,
            meta: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                version: this.currentConsentVersion,
            },
        };
    };

    private getStorageDictionaryFromEnv = (): PublicStorageItem[] => {
        if (!window.__DECORATOR_DATA__) {
            throw new Error(
                "Decorator data not available. Use the async 'isDecoratorDataAvailable' function to await for the data is available.",
            );
        }
        return window.__DECORATOR_DATA__.allowedStorage || [];
    };

    private buildConsentObject = (consent: ConsentAction) => {
        // User either consent or refuse all for now. Differentiate between analytics and surveys
        // in order to be scalable in the future.
        const analytics = consent === "CONSENT_ALL_WEB_STORAGE";
        const surveys = consent === "CONSENT_ALL_WEB_STORAGE";

        const currentConsent =
            this.getCurrentConsent() ?? this.buildDefaultConsent();

        return {
            ...currentConsent,
            consent: {
                ...currentConsent.consent,
                analytics,
                surveys,
            },
            userActionTaken: true,
            meta: {
                createdAt:
                    currentConsent.meta?.createdAt ?? new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                version: this.currentConsentVersion,
            },
        };
    };

    private consentAllStorageHandler = () => {
        const consentObject = JSON.stringify(
            this.buildConsentObject("CONSENT_ALL_WEB_STORAGE"),
        );

        Cookies.set(this.consentKey, consentObject, {
            expires: 90,
        });
    };

    private refuseOptionalStorageHandler = () => {
        const consentObject = JSON.stringify(
            this.buildConsentObject("REFUSE_OPTIONAL_WEB_STORAGE"),
        );

        Cookies.set(this.consentKey, consentObject, {
            expires: 90,
        });

        this.clearOptionalStorage();
    };

    private initEventListeners() {
        window.addEventListener(
            "consentAllWebStorage",
            this.consentAllStorageHandler,
        );
        window.addEventListener(
            "refuseOptionalWebStorage",
            this.refuseOptionalStorageHandler,
        );
    }

    private clearOptionalCookies(allOptionalStorage: PublicStorageItem[]) {
        const storedCookies = document.cookie.split(";").map((cookie) => {
            const [name, value] = cookie.trim().split("=");
            return { name, value };
        });

        allOptionalStorage.forEach((storage) => {
            const optionalStorageBase = storage.name.replace(/\*$/, "");
            const matchedCookiesForDeletion = storedCookies.filter((cookie) =>
                new RegExp(`^${optionalStorageBase}`, "i").test(cookie.name),
            );

            matchedCookiesForDeletion.forEach((cookie) => {
                const domain = location.hostname.includes("nav.no")
                    ? ".nav.no"
                    : location.hostname;

                if (domain.includes("localhost")) {
                    console.log(`Deleting cookie: ${cookie.name}`);
                }

                Cookies.remove(cookie.name, {
                    domain,
                    path: "/",
                    expires: 0,
                });
            });
        });
    }

    private clearOptionalLocalAndSessionStorage(
        allOptionalStorage: PublicStorageItem[],
    ) {
        const deleteStorage = (storage: Storage, name: string) => {
            const optionalStorageBase = name.replace(/\*$/, "");
            Object.keys(storage).forEach((key) => {
                if (new RegExp(`^${optionalStorageBase}`, "i").test(key)) {
                    storage.removeItem(key);
                }
            });
        };
        allOptionalStorage.forEach((storage) => {
            deleteStorage(localStorage, storage.name);
            deleteStorage(sessionStorage, storage.name);
        });
    }

    private awaitDecoratorData = async () => {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(
                    new Error(
                        `Timed out after ${DECORATOR_DATA_TIMEOUT}ms waiting for __DECORATOR_DATA__ to be set. Please check that the decorator is infact loading.`,
                    ),
                );
            }, DECORATOR_DATA_TIMEOUT);

            const checkForDecoratorData = () => {
                if (window.__DECORATOR_DATA__) {
                    clearTimeout(timeout);
                    resolve(true);
                } else {
                    setTimeout(checkForDecoratorData, 50);
                }
            };

            checkForDecoratorData();
        });
    };

    private async clearOptionalStorage() {
        await this.awaitDecoratorData();
        const allowedStorage = this.getAllowedStorage();
        const allOptionalStorage = allowedStorage.filter(
            (storage) => storage.optional,
        );

        this.clearOptionalCookies(allOptionalStorage);
        this.clearOptionalLocalAndSessionStorage(allOptionalStorage);
    }

    private checkAndTriggerConsentBanner() {
        const { userActionTaken, meta } = this.getCurrentConsent();
        const { version } = meta;

        // Don't show cookie banner for nav.no editors
        if (window.location.hostname.includes("oera.no")) {
            return;
        }

        // TODO: remove this on release
        if (isProd()) {
            return;
        }

        if (!userActionTaken || version < this.currentConsentVersion) {
            this.clearOptionalStorage();
            this.showConsentBanner();
        }
    }

    /* -----------------------------------------------------------------------
     * Public methods
     * ----------------------------------------------------------------------- */

    public showConsentBanner = () => {
        window.dispatchEvent(createEvent("showConsentBanner", {}));
    };

    public getCurrentConsent = (): Consent => {
        const currentConsent = Cookies.get("navno-consent");
        return currentConsent
            ? JSON.parse(currentConsent)
            : this.buildDefaultConsent();
    };

    public isStorageKeyAllowed = (key: string) => {
        const storageDictionary = this.getStorageDictionaryFromEnv();
        const isAllowed = storageDictionary.some((allowedItem) => {
            const baseName = key.split(/[-*]/)[0];
            return allowedItem.name.startsWith(baseName);
        });

        return isAllowed;
    };

    public getAllowedStorage = () => {
        const storageDictionary = this.getStorageDictionaryFromEnv();
        return Array.from(storageDictionary);
    };

    // Cleanup when no longer needed
    destroy() {
        window.removeEventListener(
            "consentAllWebStorage",
            this.consentAllStorageHandler,
        );
        window.removeEventListener(
            "refuseOptionalWebStorage",
            this.refuseOptionalStorageHandler,
        );
    }
}
