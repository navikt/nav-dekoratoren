import { HtmlElementProps } from "decorator-shared/types";
import { buildHtmlAttribsString } from "decorator-shared/html";

export const buildHtmlElementString = ({
    tag,
    attribs,
    body,
}: HtmlElementProps) =>
    `<${tag} ${buildHtmlAttribsString(attribs)}>${body ?? ""}</${tag}>`;
