export const initSkyra = () => {
    const script = document.createElement("script");
    script.src = "https://survey.skyra.no/skyra-survey.js";
    script.async = true;
    script.onload = function () {
        window.skyra.start({
            org: "arbeids-og-velferdsetaten-nav",
        });
    };
    document.body.appendChild(script);
};

export const stopSkyra = () => {
    if (typeof window.skyra?.controller?.stop === "function") {
        // Disable surveys by Skyra
        window.skyra.controller.stop();
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

    if (typeof window.skyraSurvey === "object") {
        delete window.skyraSurvey;
    }
};
