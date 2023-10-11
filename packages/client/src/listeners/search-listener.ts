import html from 'decorator-shared/html';
import { replaceElement } from '../utils';
import { SearchShowMore } from '../views/search-show-more';

import searchClasses from '../styles/search.module.css';
import headerClasses from '../styles/header.module.css';

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
              html: hits
                .map(
                  (hit: {
                    displayName: string;
                    highlight: string;
                    href: string;
                  }) =>
                    html`
                      <search-hit href="${hit.href}">
                        <h2 slot="title">${hit.displayName}</h2>
                        <p slot="description">${hit.highlight}</p>
                      </search-hit>
                    `.render(),
                )
                .join(''),
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

import { setAriaExpanded } from '../utils';

export function handleSearchButtonClick() {
  const searchButton = document.querySelector(
    `.${searchClasses.searchButton}`,
  ) as HTMLElement;

  searchButton?.addEventListener('click', () => {
    setAriaExpanded(searchButton);
    searchButton?.classList.toggle('active');
    document
      .querySelector(`.${searchClasses.sokDropdown}`)
      ?.classList.toggle('active');
    document
      .getElementById('menu-background')
      ?.classList.toggle(headerClasses.active);
  });
}
