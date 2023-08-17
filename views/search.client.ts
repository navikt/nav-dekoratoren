import { asDefined, html } from '@/utils';
// import SearchHit from './search-hit';

export const StartedSearchEvent = new Event('started-search');

export class InlineSearch extends HTMLElement {
  constructor() {
    super();
    const template = document.getElementById(
      'inline-search-template',
    ) as HTMLTemplateElement;

    if (template && template.content) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync('@import url("client/main.css")');

      // Import main

      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.adoptedStyleSheets = [sheet];
      shadowRoot.appendChild(template.content.cloneNode(true));

      // Find input
      const input = asDefined(
        shadowRoot.querySelector('input'),
      ) as HTMLInputElement;
      const closeIconButton = asDefined(
        shadowRoot.querySelector('.close-icon-button'),
      ) as HTMLElement;

      input.addEventListener('input', () => {
        const value = input.value;

        if (value.length > 0) {
          closeIconButton.style.display = 'block';
        } else {
          closeIconButton.style.display = 'none';
        }

        if (value.length > 2) {
          fetch(`/dekoratoren/api/sok?ord=${value}`)
            .then((res) => res.json())
            .then(({ hits, total }) => {
              console.log(total);
              const searchHits = asDefined(
                shadowRoot.querySelector('#inline-search-hits > ul'),
              ) as HTMLElement;

              searchHits.innerHTML = hits
                .map(
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
                )
                .join('');
            });
        }

        this.dispatchEvent(StartedSearchEvent);

        console.log(value);
        // const event = new CustomEvent('search', {
        //   detail: {
        //     value,
        //   },
        // });
        // this.dispatchEvent(event);
      });
    }
  }
}

export class SearchHit extends HTMLElement {
  constructor() {
    super();
    const template = document.getElementById(
      'search-hit-template',
    ) as HTMLTemplateElement;
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));
    const href = this.getAttribute('href');
    shadowRoot.querySelector('a')?.setAttribute('href', href as string);
  }
}

customElements.define('inline-search', InlineSearch);
customElements.define('search-hit', SearchHit);
