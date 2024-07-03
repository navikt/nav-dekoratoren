type CustomElementProps = {
    name: string;
    element: CustomElementConstructor;
    options?: ElementDefinitionOptions;
};

const customElements: Record<string, CustomElementProps> = {};

export const registerCustomElement = (
    name: string,
    element: CustomElementConstructor,
    options?: ElementDefinitionOptions,
) => {
    if (customElements[name]) {
        console.error(`Custom element for ${name} was already registered!`);
        return;
    }

    customElements[name] = { name, element, options };
};

// Custom elements should not be defined until the DOM is fully loaded. This prevents
// certain inconsistent behaviours and potential bugs in the lifecycle of custom elements
export const initCustomElements = () => {
    Object.values(customElements).forEach(({ name, element, options }) => {
        try {
            window.customElements.define(name, element, options);
        } catch (e) {
            console.error(
                `Failed to register custom element for "${name}" - ${e}`,
            );
        }
    });
};
