type CustomElementProps = {
    name: string;
    element: CustomElementConstructor;
    options?: ElementDefinitionOptions;
};

const customElementsInitQueue: Record<string, CustomElementProps> = {};

const initCustomElement = ({ name, element, options }: CustomElementProps) => {
    try {
        window.customElements.define(name, element, options);
    } catch (e) {
        console.error(`Failed to register custom element for "${name}" - ${e}`);
    }
};

// Custom elements should not be defined until the DOM is fully loaded. This prevents
// certain inconsistent behaviours and potential bugs in the lifecycle of custom elements
export const registerCustomElement = (
    name: string,
    element: CustomElementConstructor,
    options?: ElementDefinitionOptions,
) => {
    if (customElementsInitQueue[name]) {
        console.error(`Custom element for ${name} was already registered!`);
        return;
    }

    const props = { name, element, options };

    if (document.readyState === "loading") {
        customElementsInitQueue[name] = props;
    } else {
        initCustomElement(props);
    }
};

export const initCustomElements = () => {
    Object.values(customElementsInitQueue).forEach(initCustomElement);
};
