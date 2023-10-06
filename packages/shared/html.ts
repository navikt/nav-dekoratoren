type Props = Record<string, string | boolean | number | null | undefined>;

// Conditionally add props to an element
export function spreadProps(props: Props) {
  const result = [];

  for (const [key, value] of Object.entries(props)) {
    if (value) {
      result.push(`${key}="${value}"`);
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

type TemplateStringValues =
  | string
  | string[]
  | boolean
  | ((e: Element) => void)
  | NamedNodeMap
  | number
  | undefined
  | null;

export type Template = {
  strings: TemplateStringsArray;
  values: TemplateStringValues[];
};

const html = (
  strings: TemplateStringsArray,
  ...values: TemplateStringValues[]
): Template => ({
  strings,
  values,
});

export default html;

const renderValue = (item: TemplateStringValues): string =>
  Array.isArray(item)
    ? item.map(renderValue).join('')
    : // Check for boolean
    [false, undefined, null].some((value) => item === value)
    ? ''
    : typeof item === 'string'
    ? escapeHtml(item)
    : render(item as Template);

export const render = ({ strings, values }: Template): string =>
  String.raw({ raw: strings }, ...values.map(renderValue));
