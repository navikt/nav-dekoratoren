class OpsMessages extends HTMLElement {
    connectedCallback() {
        if (!this.innerHTML) {
            fetch(`${window.__DECORATOR_DATA__.env.APP_URL}/ops-messages`)
                .then((res) => res.text())
                .then((html) => {
                    if (html) {
                        this.setAttribute('aria-label', window.__DECORATOR_DATA__.texts.important_info);
                        this.innerHTML = html;
                    } else {
                        this.removeAttribute('aria-label');
                    }
                });
        }
    }
}

customElements.define('ops-messages', OpsMessages);
