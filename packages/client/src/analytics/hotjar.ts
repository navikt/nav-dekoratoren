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
};
