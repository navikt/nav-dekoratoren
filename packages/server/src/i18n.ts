import { Template } from "decorator-shared/html";
import { Language } from "decorator-shared/params";
import { Texts } from "decorator-shared/types";
import { texts } from "./texts";

function i18n(key: keyof Texts, args?: never): Template;
function i18n<Key extends keyof Texts>(
    key: Key,
    args: Texts[Key] extends (...args: any) => any
        ? Parameters<Texts[Key]>[0]
        : never,
): Template;

function i18n<Key extends keyof Texts>(
    key: Key,
    args: Texts[Key] extends (...args: any) => any
        ? Parameters<Texts[Key]>[0]
        : never,
): Template {
    return {
        render: (props: { language: Language } = { language: "nb" }) => {
            const text = texts[props.language][key];
            if (typeof text === "function") {
                return text(args);
            } else {
                return text;
            }
        },
    };
}

export default i18n;
