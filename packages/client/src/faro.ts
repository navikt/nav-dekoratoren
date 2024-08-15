/**
 * This adds information about decorator parameters to the Grafana faro. To aid with debugging.
 * */
export function addFaroMetaData() {
    if (!window.faro) {
        return;
    }

    window.faro.api.setSession({
        attributes: {
            decorator_env: JSON.stringify(window.__DECORATOR_DATA__.env),
            decorator_params: JSON.stringify(window.__DECORATOR_DATA__.params),
        },
    });
}
