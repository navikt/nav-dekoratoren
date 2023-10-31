class MainMenu extends HTMLElement {
  handleActiveContext = (event: Event) => {
    fetch(
      `${window.__DECORATOR_DATA__.env.APP_URL}/main-menu?context=${
        (event as CustomEvent).detail.context
      }`,
    )
      .then((response) => response.text())
      .then((html) => {
        this.innerHTML = html;
      });
  };


  connectedCallback() {
    window.addEventListener('activecontext', this.handleActiveContext);
  }

  disconnectedCallback() {
    window.removeEventListener('activecontext', this.handleActiveContext);
  }
}

customElements.define('main-menu', MainMenu);
