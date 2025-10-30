declare global {
    interface Window {
        dekoratorenAmplitude: any;
    }
}

export const mockAmplitude = () => {
    return Promise.resolve(
        "[DISCONTINUED] getAmplitudeInstance is discontinued and will be removed. Please see https://github.com/navikt/nav-dekoratoren for more information",
    );
};

export const initMockAmplitude = async () => {
    // This function is exposed for use from consuming applications
    window.dekoratorenAmplitude = mockAmplitude;
};
