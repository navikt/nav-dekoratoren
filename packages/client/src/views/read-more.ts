class ReadMore extends HTMLElement {
  connectedCallback() {
    const datetime = this.getAttribute('datetime');
    if (datetime) {
      this.innerHTML = new Date(datetime).toLocaleDateString(
        window.__DECORATOR_DATA__.params.language,
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        },
      );
    }
  }
}

customElements.define('read-more', ReadMore);
