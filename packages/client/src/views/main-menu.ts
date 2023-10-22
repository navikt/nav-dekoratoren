import { HeaderMenuLinks } from 'decorator-shared/views/header/header-menu-links';
import getContent from '../get-content';

class MainMenu extends HTMLElement {
  handleActiveContext = async (event: Event) => {
    const headerMenuLinks = await getContent('headerMenuLinks', {
      context: (event as CustomEvent).detail.context,
    });

    this.innerHTML = HeaderMenuLinks({
      headerMenuLinks,
      className: `cols-${headerMenuLinks.length}`,
    }).render();
  };

  connectedCallback() {
    window.addEventListener('activecontext', this.handleActiveContext);
  }

  disconnectedCallback() {
    window.removeEventListener('activecontext', this.handleActiveContext);
  }
}

customElements.define('main-menu', MainMenu);
