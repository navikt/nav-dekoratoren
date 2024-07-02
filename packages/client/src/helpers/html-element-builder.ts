import { HtmlElementProps } from "decorator-shared/types";

export const buildHtmlElement = ({ tag, attribs, body }: HtmlElementProps) => {
    const element = document.createElement(tag);

    Object.entries(attribs).forEach(([name, value]) => {
        element.setAttribute(name, value);
    });

    if (body) {
        element.textContent = body;
    }

    return element;
};
