import cls from '../styles/search-form.module.css';

class SearchMenu extends HTMLElement {
  form: HTMLFormElement | null = null;
  input: HTMLInputElement | null = null;
  hits: HTMLElement;

  constructor() {
    super();
    this.hits = document.createElement('div');
  }

  connectedCallback() {
    this.form = this.querySelector(`.${cls.searchForm}`);
    this.input = this.querySelector(`.${cls.searchInput}`);

    this.form?.addEventListener('submit', (e) => {
      e.preventDefault();

      // TODO: Use proper url
      window.location.assign(
        `https://www.ekstern.dev.nav.no/sok?ord=${this.input?.value}}`,
      );
    });

    this.input?.addEventListener('input', (e) => {
      const { value } = e.target as HTMLInputElement;
      if (value.length > 2) {
        fetch(
          `${import.meta.env.VITE_DECORATOR_BASE_URL}/api/sok?${Object.entries({
            language: window.__DECORATOR_DATA__.params.language,
            ord: this.input?.value,
          })
            .map(([key, value]) => `${key}=${value}`)
            .join('&')}`,
        )
          .then((res) => res.text())
          .then((text) => {
            this.append(this.hits);
            this.hits.innerHTML = text;
          });
      }
    });
  }
}

customElements.define('search-menu', SearchMenu);
