import { logger } from "decorator-shared/logger";

type DefineCustomElement = CustomElementRegistry["define"];

const _defineCustomElement: DefineCustomElement = (name, element, options) => {
    try {
        window.customElements.define(name, element, options);
    } catch (e) {
        logger.error(`Failed to define custom element for "${name}" - ${e}`);
    }
};

// Custom elements should not be defined until the DOM is fully loaded. This prevents
// certain inconsistent behaviours and potential bugs in the lifecycle of custom elements
export const defineCustomElement: DefineCustomElement = (
    name,
    element,
    options,
) => {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () =>
            _defineCustomElement(name, element, options),
        );
    } else {
        _defineCustomElement(name, element, options);
    }
};
