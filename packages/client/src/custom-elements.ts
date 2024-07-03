type CustomElementProps = {
    name: string;
    element: CustomElementConstructor;
    options?: ElementDefinitionOptions;
};

const customElements: CustomElementProps[] = [];

export const registerCustomElement = (
    name: string,
    element: CustomElementConstructor,
    options?: ElementDefinitionOptions,
) => {
    customElements.push({ name, element, options });
};

export const initCustomElements = () => {
    customElements.forEach(({ name, element, options }) => {
        try {
            window.customElements.define(name, element, options);
        } catch (e) {
            console.error(
                `Failed to register custom element for "${name}" - ${e}`,
            );
        }
    });
};
