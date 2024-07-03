type CustomElementProps = {
    name: string;
    element: CustomElementConstructor;
    options?: ElementDefinitionOptions;
};

const customElementsRegisterQueue: Record<string, CustomElementProps> = {};

const defineCustomElement = ({
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
export const registerCustomElement = (
    name: string,
    element: CustomElementConstructor,
    options?: ElementDefinitionOptions,
) => {
    if (customElementsRegisterQueue[name]) {
        console.error(`Custom element for ${name} was already registered!`);
        return;
    }

    const props = { name, element, options };

    if (document.readyState === "loading") {
        customElementsRegisterQueue[name] = props;
    } else {
        defineCustomElement(props);
    }
};

export const processCustomElementsRegisterQueue = () => {
    Object.values(customElementsRegisterQueue).forEach(defineCustomElement);
};
