export function replaceElement({
  selector,
  html,
  contentKey = 'innerHTML',
}: {
  selector: string;
  html: string;
  contentKey?: 'innerHTML' | 'outerHTML';
}) {
  return new Promise((resolve) => {
    const el = document.querySelector(selector);

    if (el) {
      el[contentKey] = html;
      resolve(el);
    }

    resolve(undefined);
  });
}
