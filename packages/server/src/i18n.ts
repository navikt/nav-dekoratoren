import { Context, Language } from "decorator-shared/params";
import { Texts } from "decorator-shared/types";
import { texts } from "./texts";
import { Template } from "decorator-shared/html";

export default (
    key: keyof Texts,
    args: Record<string, unknown> = {},
): Template => ({
    render: (
        props: { language: Language; context: Context } = {
            language: "nb",
            context: "privatperson",
        },
    ) =>
        Object.entries({
            ...props,
            ...args,
        }).reduce(
            (text, [key, val]) => text.replaceAll(`{${key}}`, val),
            texts[props.language][key],
        ),
});
