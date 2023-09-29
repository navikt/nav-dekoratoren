import html from 'decorator-shared/html';
// import SearchHit from './search-hit';
//
const events = {
  'started-typing': new Event('started-typing'),
  'is-searching': new Event('is-searching'),
  'finished-searching': new Event('finished-searching'),
  'stopped-searching': new Event('stopped-searching'),
};

// For when you know it is defined to avoid annoying null checks
export function asDefined<T>(value: T | undefined): NonNullable<T> {
  if (!value) {
    throw new Error('Value is undefined');
  }

  return value as NonNullable<T>;
}

export type SearchEvent = keyof typeof events;

export class InlineSearch extends HTMLElement {
  constructor() {
    super();
    const template = document.getElementById(
      'inline-search-template',
    ) as HTMLTemplateElement;

    if (template && template.content) {
      const shadowRoot = this.attachShadow({ mode: 'open' });
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
          this.dispatchEvent(events['started-typing']);
        } else {
          closeIconButton.style.display = 'none';
        }

        if (value.length > 2) {
          this.dispatchEvent(events['is-searching']);

          console.log('do search');

          shadowRoot
            .querySelector('#inline-search-hits')
            ?.classList.add('is-searching');

          fetch(`/api/sok?ord=${value}`)
            .then((res) => res.json())
            .then(({ hits }) => {
              // total
              //Stop showing loader
              this.dispatchEvent(events['finished-searching']);

              const searchHits = asDefined(
                shadowRoot.querySelector('#inline-search-hits'),
              ) as HTMLElement;

              const searchHitsList = asDefined(
                shadowRoot.querySelector('#inline-search-hits > ul'),
              ) as HTMLElement;

              searchHits.classList.remove('is-searching');
              console.log(hits);

              searchHitsList.innerHTML = hits
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
