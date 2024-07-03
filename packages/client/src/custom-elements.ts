type CustomElementProps = {
    name: string;
    element: CustomElementConstructor;
    options?: ElementDefinitionOptions;
};

const _defineCustomElement = ({
    name,
    element,
    options,
}: CustomElementProps) => {
    try {
        window.customElements.define(name, element, options);
    } catch (e) {
        console.error(`Failed to define custom element for "${name}" - ${e}`);
    }
};

// Custom elements should not be defined until the DOM is fully loaded. This prevents
// certain inconsistent behaviours and potential bugs in the lifecycle of custom elements
export const defineCustomElement = (
    name: string,
    element: CustomElementConstructor,
    options?: ElementDefinitionOptions,
) => {
    const props = { name, element, options };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () =>
            _defineCustomElement(props),
        );
    } else {
        _defineCustomElement(props);
    }
};
