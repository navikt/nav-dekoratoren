import Cookies from "js-cookie";
import { createEvent } from "./events";
import {
    ConsentAction,
    Consent,
    PublicStorageItem,
} from "decorator-shared/types";
import { endpointUrlWithoutParams } from "./helpers/urls";

const DECORATOR_DATA_TIMEOUT = 5000;

export class WebStorageController {
    currentConsentVersion: number = 1;
    consentKey: string = "navno-consent";

    constructor() {
        this.initEventListeners();
        this.checkAndTriggerConsentBanner();
    }

    // Default consent object ensures that nothing is allowed until user has
    // given and explicit consent.
    private buildDefaultConsent = () => {
        return {
            consent: { analytics: false, surveys: false },
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
            console.error(
                "Decorator data not available. Make sure decorator is loaded correctly.",
            );
            return [];
        }
        return window.__DECORATOR_DATA__.allowedStorage || [];
    };

    private buildUpdatedConsentObject = (consent: ConsentAction) => {
        // User either consent or refuse all for now. Differentiate between analytics and surveys
        // in order to be scalable in the future.
        const analytics = consent === "CONSENT_ALL_WEB_STORAGE";
        const surveys = consent === "CONSENT_ALL_WEB_STORAGE";

        const currentConsent =
            this.getCurrentConsent() ?? this.buildDefaultConsent();

        return {
            consent: { analytics, surveys },
            userActionTaken: true,
            meta: {
                createdAt:
                    currentConsent.meta?.createdAt ?? new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                version: this.currentConsentVersion,
            },
        };
    };

    private getConsentDomain = () => {
        return window.location.hostname.includes("nav.no")
            ? ".nav.no"
            : window.location.hostname;
    };

    private consentAllStorageHandler = () => {
        const consentObject = this.buildUpdatedConsentObject(
            "CONSENT_ALL_WEB_STORAGE",
        );

        Cookies.set(this.consentKey, JSON.stringify(consentObject), {
            expires: 90,
            domain: this.getConsentDomain(),
        });
        this.pingConsentBack(consentObject);
    };

    private refuseOptionalStorageHandler = () => {
        const consentObject = this.buildUpdatedConsentObject(
            "REFUSE_OPTIONAL_WEB_STORAGE",
        );

        Cookies.set(this.consentKey, JSON.stringify(consentObject), {
            expires: 90,
            domain: this.getConsentDomain(),
        });

        this.pingConsentBack(consentObject);

        setTimeout(() => {
            this.clearOptionalStorage();
        }, 1000);
    };

    private pingConsentBack = (consent: Consent) => {
        const pingBody = {
            consentObject: consent,
            originUrl: window.location.href,
        };

        fetch(endpointUrlWithoutParams(`/api/consentping`), {
            method: "POST",
            credentials: "omit",
            body: JSON.stringify(pingBody),
        });
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
        const storedCookies = Object.entries(Cookies.get()).map(
            ([name, value]) => ({ name, value }),
        );

        allOptionalStorage.forEach((storage) => {
            const optionalStorageBase = storage.name.replace(/\*$/, "");
            const matchedCookiesForDeletion = storedCookies.filter((cookie) =>
                new RegExp(`^${optionalStorageBase}`, "i").test(cookie.name),
            );

            matchedCookiesForDeletion.forEach((cookie) => {
                const domain = location.hostname.includes("nav.no")
                    ? ".nav.no"
                    : location.hostname;

                Cookies.remove(cookie.name, { domain, path: "/", expires: 0 });
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
                        `Timed out after ${DECORATOR_DATA_TIMEOUT}ms waiting for __DECORATOR_DATA__ to be set. Please check that the decorator is loading.`,
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

    private shouldDisableConsentBanner = (): boolean => {
        const disabledPatterns = {
            hostnames: ["oera.no", "cms-arkiv.ansatt", "siteimprove.com"],
            userAgents: ["siteimprove.com"],
        };

        const hostnameMatched = disabledPatterns.hostnames.some((pattern) =>
            window.location.hostname.includes(pattern),
        );

        const userAgentMatched = disabledPatterns.userAgents.some((pattern) =>
            navigator.userAgent?.toLowerCase().includes(pattern),
        );

        return hostnameMatched || userAgentMatched;
    };

    private checkAndTriggerConsentBanner() {
        const { userActionTaken, meta } = this.getCurrentConsent();
        const { version } = meta;

        // Don't show cookie banner for nav.no editors
        if (this.shouldDisableConsentBanner()) {
            return;
        }

        // Denne brukes for å sende en lenke hvor cookie-banneret trigges umiddelbart.
        // Brukes i hovedsak i innkjøringsfasen. Kan vurderes fjernet etterhvert.
        if (window.location.hash.includes("consent-reset")) {
            this.clearOptionalStorage();
            this.showConsentBanner();
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
        const { consent } = this.getCurrentConsent();
        const foundStorageObject = storageDictionary.find((storage) => {
            if (storage.name.endsWith("*")) {
                // Use regex for wildcard (*) names
                const baseName = storage.name.slice(0, -1); // Remove '*'
                return new RegExp(`^${baseName}`, "i").test(key); // Case-insensitive match
            } else {
                // Case-insensitive exact match
                return storage.name.toLowerCase() === key.toLowerCase();
            }
        });

        if (!foundStorageObject) {
            return false;
        }

        if (!foundStorageObject.optional) {
            return true;
        }

        return consent.analytics && consent.surveys;
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
