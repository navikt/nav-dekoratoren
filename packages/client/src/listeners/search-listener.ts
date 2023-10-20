import html from 'decorator-shared/html';
import { replaceElement } from '../utils';
import { SearchShowMore } from '../views/search-show-more';

import searchClasses from '../styles/search-field.module.css';

export function addSearchInputListener() {
  document
    .querySelector(`.${searchClasses.searchInput}`)
    ?.addEventListener('input', (e) => {
      const { value } = e.target as HTMLInputElement;
      console.log(value);
      if (value.length > 2) {
        fetch(`${import.meta.env.VITE_DECORATOR_BASE_URL}/api/sok?ord=${value}`)
          .then((res) => res.json())
          .then(({ hits, total }) => {
            console.log(hits);
            replaceElement({
              selector: '#search-hits > ul',
              html: hits.map(
                (hit: {
                  displayName: string;
                  highlight: string;
                  href: string;
                }) => html`
                  <search-hit href="${hit.href}">
                    <h2 slot="title">${hit.displayName}</h2>
                    <p slot="description">${hit.highlight}</p>
                  </search-hit>
                `,
              ),
            });

            replaceElement({
              selector: '#show-more',
              html: SearchShowMore({
                word: value,
                total,
              }),
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
}
