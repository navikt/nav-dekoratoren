import { formatParams } from 'decorator-shared/json';
import { Context } from 'decorator-shared/params';
import { CustomEvents } from '../events';

class MainMenu extends HTMLElement {
  fetchMenuContent = (context?: Context) =>
    fetch(
      `${window.__DECORATOR_DATA__.env.APP_URL}/main-menu?${formatParams({
        ...window.__DECORATOR_DATA__.params,
        context: context || window.__DECORATOR_DATA__.params.context,
    }
      )}`,
    )
      .then((response) => response.text())
      .then((html) => {
        this.innerHTML = html;
      });

  onContextChange = (e: CustomEvent<CustomEvents['activecontext']>) => {
    this.fetchMenuContent(e.detail.context);
  }

  connectedCallback() {
    window.addEventListener('activecontext', this.onContextChange);

    setTimeout(() => this.fetchMenuContent(), 0);
  }

  disconnectedCallback() {
    window.removeEventListener('activecontext', this.onContextChange);
  }
}

customElements.define('main-menu', MainMenu);
