import { Template } from 'decorator-shared/html';

export function replaceElement({
  selector,
  html,
  contentKey = 'innerHTML',
}: {
  selector: string;
  html: Template | Template[];
  contentKey?: 'innerHTML' | 'outerHTML';
}) {
  return new Promise((resolve) => {
    const el = document.querySelector(selector);

    if (el) {
      el[contentKey] = Array.isArray(html)
        ? html.map((h) => h.render()).join('')
        : html.render();
      resolve(el);
    }

    resolve(undefined);
  });
}
