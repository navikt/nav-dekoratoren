import { LenkeMedSporingElement } from './lenke-med-sporing';
import { erNavDekoratoren } from '../helpers/urls';
import headerClasses from '../styles/header.module.css';

class ContextLink extends LenkeMedSporingElement {
  handleActiveContext = (event: Event) =>
    this.classList.toggle(
      headerClasses.lenkeActive,
      this.getAttribute('data-context') ===
        (event as CustomEvent<{ context: string }>).detail.context,
    );

  connectedCallback() {
    window.addEventListener('activecontext', this.handleActiveContext);

    this.addEventListener('click', (e) => {
      if (erNavDekoratoren()) {
        e.preventDefault();
      }

      this.dispatchEvent(
        new CustomEvent('activecontext', {
          bubbles: true,
          detail: {
            context: this.getAttribute('data-context'),
          },
        }),
      );
    });
  }

  disconnectedCallback() {
    window.removeEventListener('activecontext', this.handleActiveContext);
  }
}

customElements.define('context-link', ContextLink, {
  extends: 'a',
});
