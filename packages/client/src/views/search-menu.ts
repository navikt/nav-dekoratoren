import html from 'decorator-shared/html';
import debounce from 'lodash.debounce';
import cls from '../styles/search-form.module.css';

class SearchMenu extends HTMLElement {
  form: HTMLFormElement | null = null;
  input: HTMLInputElement | null = null;
  hits: HTMLElement;

  constructor() {
    super();
    this.hits = document.createElement('div');
  }

  clearSearch() {
    this.hits.remove();
    if (this.input) {
      this.input.value = '';
    }
  }

  connectedCallback() {
    this.form = this.querySelector(`.${cls.searchForm}`);
    this.input = this.querySelector(`.${cls.searchInput}`);

    if (this.getAttribute('data-auto-focus') !== null) {
      this.closest('dropdown-menu')?.addEventListener('menuopened', () => {
        this.input?.focus();
      });
    }

    this.closest('dropdown-menu')?.addEventListener('menuclosed', () =>
      this.clearSearch(),
    );

    this.addEventListener('clearsearch', () => this.clearSearch());

    this.form?.addEventListener('submit', (e) => {
      e.preventDefault();

      // TODO: Use proper url
      window.location.assign(
        `https://www.ekstern.dev.nav.no/sok?ord=${this.input?.value}}`,
      );
    });

    const fetchSearch = (query: string) =>
      fetch(
        `${import.meta.env.VITE_DECORATOR_BASE_URL}/api/search?${Object.entries(
          {
            language: window.__DECORATOR_DATA__.params.language,
            q: query,
          },
        )
          .map(([key, value]) => `${key}=${value}`)
          .join('&')}`,
      )
        .then((res) => res.text())
        .then((text) => {
          if (this.input?.value === query) {
            this.hits.innerHTML = text;
          }
        });

    const fetchSearchDebounced = debounce(fetchSearch, 500);

    this.input?.addEventListener('input', (e) => {
      const { value } = e.target as HTMLInputElement;
      if (value.length > 2) {
        this.append(this.hits);
        this.hits.innerHTML = html`<decorator-loader
          title="${window.__DECORATOR_DATA__.texts.loading_preview}"
        />`.render();

        fetchSearchDebounced(value);
      } else {
        this.hits.remove();
      }
    });
  }
}

customElements.define('search-menu', SearchMenu);
