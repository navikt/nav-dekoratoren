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

type TemplateStringValues =
  | string
  | string[]
  | boolean
  | ((e: Element) => void)
  | NamedNodeMap
  | undefined
  | null;

const html = (
  strings: TemplateStringsArray,
  ...values: TemplateStringValues[]
) =>
  String.raw(
    { raw: strings },
    ...values.map((item) =>
      Array.isArray(item)
        ? item.join('')
        : // Check for boolean
        [false, undefined, null].some((value) => item === value)
        ? ''
        : item,
    ),
  );

export default html;
