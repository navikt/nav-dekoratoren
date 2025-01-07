import Cookies from "js-cookie";

type ConsentType =
    | "CONSENT_ALL_WEB_STORAGE"
    | "REFUSE_OPTIONAL_WEB_STORAGE"
    | null;

export class WebStorageController {
    consentVersion: string = "1.0.0";
    consentKey: string = `navno-consent-${this.consentVersion}`;

    constructor() {
        this.initEventListeners();
        this.checkConsent();
        console.log("WebStorageController initialized");
    }

    private handleConsentAllWebStorage = () => {
        Cookies.set(this.consentKey, "CONSENT_ALL_WEB_STORAGE");
    };

    private refuseOptionalWebStorage = () => {
        Cookies.set(this.consentKey, "REFUSE_OPTIONAL_WEB_STORAGE");
    };

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

    public checkConsent() {
        const givenConsent = this.validateConsent(Cookies.get(this.consentKey));
        return { allowOptional: givenConsent === "CONSENT_ALL_WEB_STORAGE" };
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
