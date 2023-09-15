import { type Params } from 'decorator-shared/params';
import html from 'decorator-shared/html';

declare global {
  interface HTMLElementTagNameMap {
    'decorator-lens': DecoratorLens;
  }
}

export function attachLensListener() {
  document.body.addEventListener('keydown', (e) => {
    // Listen for f5
    const lens = document.querySelector('decorator-lens') as DecoratorLens;
    if (e.key === 'F4' && lens) {
      lens.classList.toggle('active');
    }
  });
}

export class DecoratorLens extends HTMLElement {
  activeParams: Partial<Params> = {};
  explicitParams: Partial<Params> = {};

  constructor() {
    super();
    const template = document.getElementById(
      'decorator-lens-template',
    ) as HTMLTemplateElement;

    if (template && template.content) {
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(template.content.cloneNode(true));

      this.activeParams = JSON.parse(
        shadowRoot.querySelector('script#active-params')?.innerHTML ?? '{}',
      );
      this.explicitParams = JSON.parse(
        shadowRoot.querySelector('script#explicit-params')?.innerHTML ?? '{}',
      );

      const wrapper = shadowRoot.querySelector('#decorator-lens-wrapper');

      if (!wrapper) {
        return;
      }

      //@TODO: Talk with terje and discuss a good interface for working with the decoratør
      wrapper.innerHTML = html`
        <div>
          <h2>Active params</h2>
          <ul>
            ${Object.entries(this.activeParams).map(([key, value]) => {
              return html`<li
                data-key="${key}"
                data-value="${value.toString()}"
              >
                ${key}: ${value.toString()}
              </li>`;
            })}
          </ul>
        </div>
        <div>
          <h2>explicit params</h2>
          <ul>
            ${Object.entries(this.explicitParams).map(([key, value]) => {
              return html`<li
                data-key="${key}"
                data-value="${value.toString()}"
              >
                ${key}: <a href="${value.toString()}">${value.toString()}</a>
              </li>`;
            })}
          </ul>
        </div>
      `;
    }
  }
}

customElements.define('decorator-lens', DecoratorLens);
