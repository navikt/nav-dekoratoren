class MainMenu extends HTMLElement {
  fetchMenuContent = (context: string) =>
    fetch(
      `${window.__DECORATOR_DATA__.env.APP_URL}/main-menu?context=${context}`,
    )
      .then((response) => response.text())
      .then((html) => {
          console.log(html, window.__DECORATOR_DATA__.env.APP_URL)
        this.innerHTML = html;
      });

  handleActiveContext = (event: Event) =>
    this.fetchMenuContent((event as CustomEvent).detail.context);

  connectedCallback() {
    window.addEventListener('activecontext', this.handleActiveContext);

    const onLoad = () => {
      this.fetchMenuContent(window.__DECORATOR_DATA__.params.context);
      window.removeEventListener('load', onLoad);
    };
    window.addEventListener('load', onLoad);
  }

  disconnectedCallback() {
    window.removeEventListener('activecontext', this.handleActiveContext);
  }
}

customElements.define('main-menu', MainMenu);
