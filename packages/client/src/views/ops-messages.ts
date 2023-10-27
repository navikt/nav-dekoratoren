class OpsMessages extends HTMLElement {
  connectedCallback() {
    fetch(`${import.meta.env.VITE_DECORATOR_BASE_URL}/ops-messages`)
      .then((res) => res.text())
      .then((html) => {
        if (html) {
          this.setAttribute(
            'aria-label',
            window.__DECORATOR_DATA__.texts.important_info,
          );
          this.innerHTML = html;
        } else {
          this.removeAttribute('aria-label');
          this.innerHTML = '';
        }
      });
  }
}

customElements.define('ops-messages', OpsMessages);
