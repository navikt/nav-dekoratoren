import { CsrPayload } from "decorator-shared/types";
import { buildHtmlElement } from "./helpers/html-element-builder";

const findOrError = (id: string) => {
    const el = document.getElementById(id);

    if (!el) {
        throw new Error(
            `Could not find element with id ${id}. See documentation on nav-dekoratoren on github.`,
        );
    }

    return el as HTMLDivElement;
};

async function hydrate() {
    const [header, footer, envEl] = [
        "decorator-header",
        "decorator-footer",
        "decorator-env",
    ].map(findOrError);

    const envUrl = envEl.dataset.src as string;

    const response = await fetch(envUrl);
    const elements = (await response.json()) as CsrPayload;

    header.outerHTML = elements.header;
    footer.outerHTML = elements.footer;

    // Set decorator state before script evaulation
    window.__DECORATOR_DATA__ = elements.data;

    elements.scripts
        .map(buildHtmlElement)
        .forEach((script) => document.body.appendChild(script));
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hydrate);
} else {
    hydrate();
}
