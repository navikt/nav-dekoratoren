export const initSkyra = () => {
    const script = document.createElement("script");
    script.src = "https://survey.skyra.no/skyra-survey.js";
    script.onload = function () {
        window.skyra.start({
            org: "arbeids-og-velferdsetaten-nav",
        });
    };
    document.body.appendChild(script);
};

export const stopSkyra = () => {
    if (typeof window.skyra !== "undefined") {
        // Disable tracking by Hotjar
        window.hj("trigger", "stop_tracking");
        window.hj("clearSession");
    }

    // Remove Hotjar script from the DOM
    const skyraScript = document.querySelector('script[src*="skyra"]');

    if (skyraScript) {
        skyraScript.remove();
    }

    if (typeof window.skyra === "object") {
        delete window.skyra;
    }

    if (typeof window.skyraSurvey === "object") {
        delete window.skyraSurvey;
    }
};
