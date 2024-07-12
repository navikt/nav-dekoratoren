import { HtmlElementProps } from "decorator-shared/types";

export const buildHtmlElement = ({ tag, attribs, body }: HtmlElementProps) => {
    const element = document.createElement(tag);

    for (const key in attribs) {
        element.setAttribute(key, attribs[key]);
    }

    if (body) {
        element.textContent = body;
    }

    return element;
};
