import { Template } from "decorator-shared/html";

export function replaceElement({
    selector,
    html,
    contentKey = "innerHTML",
}: {
    selector: string;
    html: Template | Template[];
    contentKey?: "innerHTML" | "outerHTML";
}) {
    return new Promise((resolve) => {
        const el = document.querySelector(selector);

        if (el) {
            el[contentKey] = Array.isArray(html)
                ? html.map((h) => h.render()).join("")
                : html.render();
            resolve(el);
        }

        resolve(undefined);
    });
}

// @NOTE: can maybe use HTML rewriter here to append scripts based on cookies?
export const loadedScripts = new Set<string>();

export const loadExternalScript = (uri: string, async = true) => {
    return new Promise<void>((resolve) => {
        if (loadedScripts.has(uri)) {
            return resolve();
        }

        loadedScripts.add(uri);
        const script = document.createElement("script");
        if (async) {
            script.async = true;
        }
        script.src = uri;
        script.onload = () => {
            resolve();
        };
        document.body.appendChild(script);
    });
};
