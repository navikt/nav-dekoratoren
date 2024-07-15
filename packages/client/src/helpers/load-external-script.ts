export const loadedScripts = new Map<string, Promise<void>>();

export default (uri: string, async = true): Promise<void> => {
    const existing = loadedScripts.get(uri);
    if (existing) {
        return existing;
    }
    const script = document.createElement("script");
    if (async) {
        script.async = true;
    }
    script.src = uri;
    const promise = new Promise<void>((resolve) => {
        script.onload = () => {
            resolve();
        };
    });
    loadedScripts.set(uri, promise);
    document.body.appendChild(script);
    return promise;
};
