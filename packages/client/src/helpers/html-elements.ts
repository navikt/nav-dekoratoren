import { HtmlElementProps } from "decorator-shared/types";

export const htmlElementExists = ({ tag, attribs }: HtmlElementProps) => {
    const selector = Object.entries(attribs).reduce(
        (acc, [key, value]) => `${acc}[${key}="${value}"]`,
        tag,
    );

    const result = !!document.querySelector(selector);

    console.log(`Result for ${selector}: ${result}`);

    return result;
};

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
