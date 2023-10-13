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

/**
 * Used to check if an element or it's parents has a class. Usefull when using event listeners where you don't directly attach to the element
 */
// @TODO: These two can probably be conssolidated somehow.
export function hasClass({
  element,
  className,
}: {
  element: HTMLElement | null;
  className: string;
}): HTMLElement | null {
  let currentElement: HTMLElement | null = element;

  while (currentElement) {
    if (currentElement.classList.contains(className)) {
      return currentElement;
    }
    currentElement = currentElement.parentElement;
  }

  return null;
}

export function hasId({
  element,
  id,
}: {
  element: HTMLElement | null;
  id: string;
}): boolean {
  let currentElement: HTMLElement | null = element;

  while (currentElement) {
    if (currentElement.id.includes(id)) {
      return true;
    }
    currentElement = currentElement.parentElement;
  }

  return false;
}
