import { CsrPayload } from "decorator-shared/types";
import { buildHtmlElement } from "./helpers/html-element-builder";
import { corgi } from "@itsy/corgi";
import { logger } from "./helpers/logger";

const SEE_ALSO = "See github.com/navikt/nav-dekoratoren";

const findOrError = (id: string) => {
    const el = document.getElementById(`decorator-${id}`);

    if (!el) {
        throw new Error(`No elem:${id}. ${SEE_ALSO}`);
    }

    return el;
};

const hydrate = async () => {
    const srcUrl = findOrError("env").dataset.src;
    if (!srcUrl) throw new Error(`No data-src on decorator-env. ${SEE_ALSO}`);
    try {
        const elements = await corgi<CsrPayload>(srcUrl);
        (["header", "footer"] as const).forEach(
            (key) => (findOrError(key).outerHTML = elements[key]),
        );
        window.__DECORATOR_DATA__ = elements.data;
        document.body.append(...elements.scripts.map(buildHtmlElement));
    } catch (error) {
        logger.error("Failed to hydrate decorator (CSR)", { error });
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hydrate);
} else {
    hydrate();
}
