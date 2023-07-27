
export function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}


export const html = (strings: TemplateStringsArray, ...values: any[]) => String.raw({ raw: strings }, ...values);
