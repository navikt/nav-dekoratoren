import { HtmlTagProps } from "decorator-shared/types";
import { buildHtmlAttribsString } from "decorator-shared/html";

export const buildHtmlElementString = ({
    tag,
    attribs,
    body,
    selfClosing,
}: HtmlTagProps) => {
    const attribsString = buildHtmlAttribsString(attribs);

    if (selfClosing) {
        return `<${tag} ${attribsString} />`;
    }

    return `<${tag} ${attribsString}>${body ?? ""}</${tag}>`;
};