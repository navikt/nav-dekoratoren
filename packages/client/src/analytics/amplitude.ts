declare global {
    interface Window {
        dekoratorenAmplitude: any;
    }
}

export const mockAmplitude = () => {
    return Promise.resolve(
        "[DISCONTINUED] dekoratorenAmplitude is discontinued and will be removed. Use dekoratorenAnalytics instead. Please see https://github.com/navikt/nav-dekoratoren for more information",
    );
};

export const initMockAmplitude = async () => {
    // This function is exposed for use from consuming applications
    window.dekoratorenAmplitude = mockAmplitude;
};
