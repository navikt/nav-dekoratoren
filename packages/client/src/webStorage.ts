import Cookies from "js-cookie";
import { createEvent } from "./events";
import {
    getAllowedStorage,
    awaitDecoratorData,
} from "@navikt/nav-dekoratoren-moduler";

type ConsentType =
    | "CONSENT_ALL_WEB_STORAGE"
    | "REFUSE_OPTIONAL_WEB_STORAGE"
    | null;

export class WebStorageController {
    consentVersion: string = "1.0.1";
    consentKey: string = `navno-consent-${this.consentVersion}`;

    constructor() {
        this.initEventListeners();
        this.checkAndTriggerConsentBanner();

        console.log("WebStorageController initialized");
    }

    private handleConsentAllWebStorage = () => {
        Cookies.set(this.consentKey, "CONSENT_ALL_WEB_STORAGE", {
            expires: 365,
        });
    };

    private refuseOptionalWebStorage = () => {
        Cookies.set(this.consentKey, "REFUSE_OPTIONAL_WEB_STORAGE", {
            expires: 365,
        });

        this.deleteOptionalWebStorage();
    };

    private deleteOptionalWebStorage() {
        // Delete optional web storage
    }

    // Initialize event listeners
    private initEventListeners() {
        window.addEventListener(
            "consentAllWebStorage",
            this.handleConsentAllWebStorage,
        );
        window.addEventListener(
            "refuseOptionalWebStorage",
            this.refuseOptionalWebStorage,
        );
    }

    private async clearKnownStorage() {
        await awaitDecoratorData();
        const allowedStorage = getAllowedStorage();

        const optionalStorage = allowedStorage.filter(
            (storage) => storage.optional,
        );

        const storedCookies = document.cookie.split(";").map((cookie) => {
            const [name, value] = cookie.trim().split("=");
            return { name, value };
        });

        optionalStorage.forEach((storage) => {
            const optionalStorageBase = storage.name.replace("*", "");
            const storedCookie = storedCookies.find((cookie) =>
                cookie.name.startsWith(optionalStorageBase),
            );

            if (storedCookie?.name.startsWith(optionalStorageBase)) {
                console.log(`Deleting ${storedCookie.name}`);
                Cookies.remove(storedCookie.name);
            }
        });
    }

    private validateConsent(consent: string | undefined): ConsentType {
        if (consent === undefined) {
            return null;
        } else {
            return [
                "CONSENT_ALL_WEB_STORAGE",
                "REFUSE_OPTIONAL_WEB_STORAGE",
            ].includes(consent)
                ? (consent as ConsentType)
                : null;
        }
    }

    private checkAndTriggerConsentBanner() {
        const { shouldShowBanner } = this.checkConsent();
        if (shouldShowBanner) {
            window.dispatchEvent(createEvent("showConsentBanner", {}));
            this.clearKnownStorage();
        }
    }

    public checkConsent() {
        const givenConsent = this.validateConsent(Cookies.get(this.consentKey));
        return {
            shouldShowBanner: givenConsent === null,
            allowOptional: givenConsent === "CONSENT_ALL_WEB_STORAGE",
        };
    }

    // Cleanup when no longer needed
    destroy() {
        window.removeEventListener(
            "consentAllWebStorage",
            this.handleConsentAllWebStorage,
        );
        window.removeEventListener(
            "refuseOptionalWebStorage",
            this.refuseOptionalWebStorage,
        );
    }
}
