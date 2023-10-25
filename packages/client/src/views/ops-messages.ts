class OpsMessages extends HTMLElement {
  connectedCallback() {
    fetch(`${import.meta.env.VITE_DECORATOR_BASE_URL}/ops-messages`)
      .then((res) => res.text())
      .then((html) => {
        if (html) {
          this.setAttribute('aria-label', 'Viktig informasjon: ');
          this.innerHTML = html;
        } else {
          this.innerHTML = '';
        }
      });
  }
}

customElements.define('ops-messages', OpsMessages);
