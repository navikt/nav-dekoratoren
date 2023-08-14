import { AvailableLanguage } from '@/params';

declare global {
  interface HTMLElementTagNameMap {
    'toggle-icon-button': ToggleIconButton;
  }
}

export class ToggleIconButton extends HTMLElement {
  button;

  set availableLanguages(availableLanguages: AvailableLanguage[]) {
    this.button.classList.toggle('active');
  }

  constructor() {
    super();
    this.button = document.createElement('div');
    // this.button.classList.add('decorator-language-selector-menu');
    // this.button.classList.add('hidden');
    const template = document.getElementById(
      'toggle-icon-button-template',
    ) as HTMLTemplateElement;

    if (template && template.content) {
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(template.content.cloneNode(true));

      shadowRoot.addEventListener('click', () => {
        console.log('click');
        shadowRoot.querySelector('button')?.classList.toggle('active');
      });
    }
  }
}

customElements.define('toggle-icon-button', ToggleIconButton);
