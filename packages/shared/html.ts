import { P, match } from 'ts-pattern';

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
    const str = '' + string;
    const match = matchHtmlRegExp.exec(str);

    if (!match) {
        return str;
    }

    let escape;
    let html = '';
    let index;
    let lastIndex = 0;

    for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
            case 34: // "
                escape = '&quot;';
                break;
            case 38: // &
                escape = '&amp;';
                break;
            case 39: // '
                escape = '&#x27;'; // modified from escape-html; used to be '&#39'
                break;
            case 60: // <
                escape = '&lt;';
                break;
            case 62: // >
                escape = '&gt;';
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

type TemplateStringValues = string | string[] | Template | Template[] | boolean | number | undefined | null;

export type Template = {
    render: () => string;
};

const html = (strings: TemplateStringsArray, ...values: TemplateStringValues[]): Template => ({
    render: () => String.raw({ raw: strings }, ...values.map(renderValue)),
});

export const json = (value: any): Template => unsafeHtml(JSON.stringify(value));

export const unsafeHtml = (htmlString: string) => ({
    render: () => htmlString,
});

export default html;

const renderValue = (item: TemplateStringValues): string =>
    match(item)
        // Join arrays
        .with(P.array(P.any), (items) => items.map(renderValue).join(''))
        // Nullish values to empty string
        .with(P.union(false, P.nullish), () => '')
        // Escape strings
        .with(P.string, (str) => escapeHtml(str))
        // Convert numbers to string
        .with(P.number, (num) => String(num))
        // Make "true" into true string
        .with(true, () => 'true')
        // Render template
        .with(P.select(), (template) => template.render().trim())
        .exhaustive();
// .otherwise((template) => template.render());

type AttribueValue = number | string | boolean | string[];

const toKebabCase = (str: string) => str.replace(/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g, (match) => '-' + match.toLowerCase());

export const htmlAttributes = (attributes: Record<string, AttribueValue>): Template => {
    return unsafeHtml(
        Object.entries(attributes)
            .filter(([, value]) => value !== undefined && value !== null)
            .map(([name, value]: [string, AttribueValue]): [string, AttribueValue] => [name === 'className' ? 'class' : name, value])
            .map(([name, value]) => (typeof value === 'boolean' ? (value ? toKebabCase(name) : '') : `${toKebabCase(name)}="${value}"`))
            .filter(Boolean)
            .join(' ')
    );
};
