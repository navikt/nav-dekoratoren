export class SearchHit extends HTMLElement {
  constructor() {
    super();
    const template = document.getElementById(
      'search-hit-template',
    ) as HTMLTemplateElement;
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));

    const index = this.getAttribute('data-index')
      ? parseInt(this.getAttribute('data-index') as string)
      : 0;
    const href = this.getAttribute('href');
    const link = shadowRoot.querySelector('a');

    link?.setAttribute('href', href as string);
    link?.addEventListener('click', () => {
      window.logAmplitudeEvent('resultat-klikk', {
        destinasjon: '[redacted]',
        sokeord: '[redacted]',
        treffnr: index + 1,
      });
    });
  }
}

customElements.define('search-hit', SearchHit);
