export const loadedScripts = new Map<string, Promise<void>>();

export const reset = () => {
    loadedScripts.clear();
};

export const loadExternalScript = (uri: string, async = true) => {
    if (loadedScripts.has(uri)) {
        return loadedScripts.get(uri);
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
