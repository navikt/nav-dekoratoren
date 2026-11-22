/**
 * Adds the decorator's env and params to the consuming app's Grafana Faro session, to aid with debugging.
 * Faro is set up by the app, directly or through @nais/apm.
 * */
export function addFaroMetaData() {
	// The app owns Faro and its version, so don't assume the API is there
	window.faro?.api?.setSession?.({
		attributes: {
			decorator_env: JSON.stringify(window.__DECORATOR_DATA__.env),
			decorator_params: JSON.stringify(window.__DECORATOR_DATA__.params),
		},
	});
}
