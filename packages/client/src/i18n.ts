import { Template } from "decorator-shared/html";
import { Context, Language } from "decorator-shared/params";
import { ClientTexts } from "decorator-shared/types";

export default (key: keyof ClientTexts): Template => ({
    render: (
        props: { language: Language; context: Context } = {
            language: "nb",
            context: "privatperson",
        },
    ) =>
        Object.entries({
            ...props,
        }).reduce(
            (text, [key, val]) => text.replaceAll(`{${key}}`, val),
            window.__DECORATOR_DATA__.texts[key],
        ),
});
