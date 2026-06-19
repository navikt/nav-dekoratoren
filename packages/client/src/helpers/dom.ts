import type { Template } from "decorator-shared/html";
import type { Language } from "decorator-shared/params";

export const getRequiredElement = <T extends Element>(
    root: ParentNode,
    selector: string,
): T => {
    const element = root.querySelector(selector);

    if (!element) {
        throw new Error(`Missing required element: ${selector}`);
    }

    return element as T;
};

export const templateToFragment = (
    template: Template,
    language: Language,
): DocumentFragment => {
    const element = document.createElement("template");
    element.innerHTML = template.render({ language });
    return element.content;
};
