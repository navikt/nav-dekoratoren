import { formatParams } from 'decorator-shared/json';

class MainMenu extends HTMLElement {
  fetchMenuContent = () =>
    fetch(
      `${window.__DECORATOR_DATA__.env.APP_URL}/main-menu?${formatParams(
        window.__DECORATOR_DATA__.params,
      )}`,
    )
      .then((response) => response.text())
      .then((html) => {
        this.innerHTML = html;
      });

  connectedCallback() {
    window.addEventListener('activecontext', this.fetchMenuContent);
    setTimeout(() => this.fetchMenuContent(), 0);
  }

  disconnectedCallback() {
    window.removeEventListener('activecontext', this.fetchMenuContent);
  }
}

customElements.define('main-menu', MainMenu);
