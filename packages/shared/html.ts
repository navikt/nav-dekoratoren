import type { Language } from "./params";

type Props = Record<string, string | boolean | number | null | undefined>;

// Conditionally add props to an element
export function spreadProps(props: Props) {
    const result = [];

    for (const [key, value] of Object.entries(props)) {
        if (value) {
            result.push(html`${key}="${value}"`);
        }
    }

    return result;
}

const matchHtmlRegExp = /["'&<>]/;

function escapeHtml(string: string) {
    const str = "" + string;
    const match = matchHtmlRegExp.exec(str);

    if (!match) {
        return str;
    }

    let escape;
    let html = "";
    let index;
    let lastIndex = 0;

    for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
            case 34: // "
                escape = "&quot;";
                break;
            case 38: // &
                escape = "&amp;";
                break;
            case 39: // '
                escape = "&#x27;"; // modified from escape-html; used to be '&#39'
                break;
            case 60: // <
                escape = "&lt;";
                break;
            case 62: // >
                escape = "&gt;";
                break;
            default:
                continue;
        }

        if (lastIndex !== index) {
            html += str.slice(lastIndex, index);
        }

        lastIndex = index + 1;
        html += escape;
    }

    return lastIndex !== index ? html + str.slice(lastIndex, index) : html;
}

type TemplateStringValues =
    | string
    | string[]
    | Template
    | Template[]
    | boolean
    | number
    | undefined
    | null;

export type Template = {
    render: (params: { language: Language }) => string;
};

const html = (
    strings: TemplateStringsArray,
    ...values: TemplateStringValues[]
): Template => ({
    render: (params) => {
        const renderValue = (item: TemplateStringValues): string => {
            if (Array.isArray(item)) {
                // Join arrays
                return item.map(renderValue).join("");
            } else if (item === false || item === null || item === undefined) {
                // Nullish values to empty string
                return "";
            } else if (typeof item === "string") {
                // Escape strings
                return escapeHtml(item);
            } else if (typeof item === "number" || item === true) {
                // Convert numbers and true to string
                return String(item);
            } else {
                // Render template
                return item.render(params).trim();
            }
        };

        return String.raw({ raw: strings }, ...values.map(renderValue));
    },
});

export const json = (value: any): Template => unsafeHtml(JSON.stringify(value));

export const unsafeHtml = (htmlString: string) => ({
    render: () => htmlString,
});

export default html;

export type AttributeValue = undefined | number | string | boolean | string[];

const toKebabCase = (str: string) =>
    str.replace(
        /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g,
        (match) => "-" + match.toLowerCase(),
    );

export const buildHtmlAttribsString = (
    attributes: Record<string, AttributeValue>,
) =>
    Object.entries(attributes)
        .filter(
            ([, value]) =>
                value !== undefined && value !== null && value !== false,
        )
        .map(([name, value]) => {
            const nameFinal =
                name === "className" ? "class" : toKebabCase(name);

            return value === true ? nameFinal : `${nameFinal}="${value}"`;
        })
        .join(" ");

export const htmlAttributes = (
    attributes: Record<string, AttributeValue>,
): Template => {
    return unsafeHtml(buildHtmlAttribsString(attributes));
};
