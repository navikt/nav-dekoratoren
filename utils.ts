import { Texts } from "./texts";

export function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

type TemplateStringValues = string | string[] | boolean;

export const html = (strings: TemplateStringsArray, ...values: TemplateStringValues[]) =>
  String.raw(
    { raw: strings },
    ...values.map((item) =>
                   (Array.isArray(item) ? item.join("")
                    // Check for boolean
                    : item === false ? "" : item
                   ))
  );

type PropsWithText<T> = T & { texts: Texts };
