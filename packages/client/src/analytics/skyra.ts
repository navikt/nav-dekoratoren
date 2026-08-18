export const initSkyra = () => {
    window.SKYRA_CONFIG = {
        org: "arbeids-og-velferdsetaten-nav",
        cookieConsent: true,
    };

    const script = document.createElement("script");
    script.src = "https://survey.skyra.no/skyra-survey.js";
    script.async = true;
    document.body.appendChild(script);
};

export const stopSkyra = () => {
    if (typeof window.skyra?.controller?.stop === "function") {
        // Disable surveys by Skyra
        window.skyra.setConsent(false);
    }

    if (window.SKYRA_CONFIG) {
        delete window.SKYRA_CONFIG;
    }

    // Remove Skyra script from DOM
    const skyraScript = document.querySelector(
        'script[src*="skyra-survey.js"]',
    );

    if (skyraScript) {
        skyraScript.remove();
    }

    // Remove Skyra object from window
    if (typeof window.skyra === "object") {
        delete window.skyra;
    }

    // Not possible to delete skyraSurvey
    // as it's not a 'configurable' window property
    if (typeof window.skyraSurvey === "object") {
        window.skyraSurvey = null;
    }
};
