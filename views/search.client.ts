export class InlineSearch extends HTMLElement {
  constructor() {
    super();
    const template = document.getElementById(
      'inline-search-template',
    ) as HTMLTemplateElement;

    if (template && template.content) {
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }
}

customElements.define('inline-search', InlineSearch);
