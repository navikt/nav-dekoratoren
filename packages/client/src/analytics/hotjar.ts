export const initHotjar = () => {
    if (typeof window.initConditionalHotjar === "function") {
        window.initConditionalHotjar();
    }
};

export const stopHotjar = () => {
    if (typeof window.hj === "function") {
        // Disable tracking by Hotjar
        window.hj("trigger", "stop_tracking");
        window.hj("clearSession");
    }

    // Remove Hotjar script from the DOM
    const hotjarScript = document.querySelector('script[src*="hotjar"]');

    if (hotjarScript) {
        hotjarScript.remove();
    }

    if (typeof window.hj === "function") {
        // Disable tracking by Hotjar
        window.hj("trigger", "stop_tracking");
        window.hj("clearSession");
        delete window.hj;
    }

    if (typeof window._hjSettings === "object") {
        delete window._hjSettings;
    }

    if (typeof window.hjBootstrap === "function") {
        delete window.hjBootstrap;
    }

    if (typeof window.hjBootstrapCalled === "object") {
        delete window.hjBootstrapCalled;
    }
    if (typeof window.hjLazyModules === "object") {
        delete window.hjLazyModules;
    }
    if (typeof window.hjSiteSettings === "object") {
        delete window.hjSiteSettings;
    }
};
