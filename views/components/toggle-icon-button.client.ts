declare global {
  interface HTMLElementTagNameMap {
    'toggle-icon-button': ToggleIconButton;
    'search-button': SearchButton;
  }
}

export class ToggleIconButton extends HTMLElement {
  constructor() {
    super();
    const template = document.getElementById(
      'toggle-icon-button-template',
    ) as HTMLTemplateElement;

    if (template && template.content) {
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(template.content.cloneNode(true));

      shadowRoot.addEventListener('click', () => {
        shadowRoot.querySelector('button')?.classList.toggle('active');
      });
    }
  }
}

export class SearchButton extends HTMLElement {
  constructor() {
    super();
    const template = document.getElementById(
      'toggle-icon-button-template',
    ) as HTMLTemplateElement;

    if (template && template.content) {
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(template.content.cloneNode(true));

      shadowRoot.addEventListener('click', () => {
        shadowRoot.querySelector('button')?.classList.toggle('active');

        document.getElementById('sok-dropdown')?.classList.toggle('active');
        document.getElementById('menu-background')?.classList.toggle('active');
      });
    }
  }
}

customElements.define('toggle-icon-button', ToggleIconButton);
customElements.define('search-button', SearchButton);
