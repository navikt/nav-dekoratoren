import { HtmlTagProps } from "decorator-shared/types";

export const buildHtmlElementString = ({
    tag,
    attribs,
    body,
    selfClosing,
}: HtmlTagProps) => {
    const attribsString = Object.entries(attribs)
        .map(([name, value]) => {
            return value === true ? name : `${name}="${value}"`;
        })
        .join(" ");

    if (selfClosing) {
        return `<${tag} ${attribsString} />`;
    }

    return `<${tag} ${attribsString}>${body || ""}</${tag}>`;
};
