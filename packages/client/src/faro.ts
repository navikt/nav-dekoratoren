/**
 * This adds information about decorator parameters to the Grafana faro. To aid with debugging.
 * */
export function addFaroMetaData() {
    if (!window.faro) return;

    window.faro.api.setSession({
        attributes: {
            ...window.__DECORATOR_DATA__.env,
        },
    });

    console.log('Faro: Adding metadata');
}
