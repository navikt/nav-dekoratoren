declare global {
  interface HTMLElementTagNameMap {
    'toggle-icon-button': ToggleIconButton;
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

customElements.define('toggle-icon-button', ToggleIconButton);
