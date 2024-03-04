export class CustomLinkComponent extends HTMLElement {
    protected readonly anchor: HTMLAnchorElement;

    constructor() {
        super();

        this.anchor = document.createElement('a');
        this.anchor.href = this.getAttribute('href') || '';
        this.anchor.innerHTML = this.innerHTML;
        this.anchor.classList.add(...this.classList);

        this.classList.remove(...this.classList);

        this.innerHTML = '';
        this.appendChild(this.anchor);
    }
}
