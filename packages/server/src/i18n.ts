import { Template } from "decorator-shared/html";
import { Language } from "decorator-shared/params";
import { Texts } from "decorator-shared/types";
import { texts } from "./texts";

export default (
    key: keyof Texts,
    args: Record<string, unknown> = {},
): Template => ({
    render: (props: { language: Language } = { language: "nb" }) =>
        Object.entries(args).reduce(
            (text, [key, val]) => text.replaceAll(`{${key}}`, `${val}`),
            texts[props.language][key],
        ),
});
