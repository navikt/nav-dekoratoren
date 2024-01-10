class LoginButton extends HTMLElement {
    handleClick() {
        const loginLevel = window.__DECORATOR_DATA__.params.level || 'Level4';
        const url = `${window.__DECORATOR_DATA__.env.LOGIN_URL}?redirect=${window.location.href}&level=${loginLevel}`;
        window.location.href = url;
    }

    connectedCallback() {
        this.addEventListener('click', this.handleClick);
    }
}

customElements.define('login-button', LoginButton);
