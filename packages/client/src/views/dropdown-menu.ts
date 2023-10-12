import headerClasses from 'decorator-client/src/styles/header.module.css';

class DropdownMenu extends HTMLElement {
  content: HTMLElement | null = null;
  button: HTMLElement | null = null;
  #open: boolean = false;

  constructor() {
    super();
    this.handleWindowClick = this.handleWindowClick.bind(this);
  }

  handleWindowClick(e: MouseEvent) {
    if (!this.contains(e.target as Node)) {
      this.open = false;
    }
  }

  set open(open: boolean) {
    if (open !== this.#open) {
      this.dispatchEvent(
        new Event(open ? 'menuopened' : 'menuclosed', { bubbles: true }),
      );
      this.content?.classList.toggle(headerClasses.active, open);
      this.#open = open;
    }
  }

  connectedCallback() {
    this.button = this.querySelector('button.dropdown-menu-button');
    this.content = this.querySelector(`.${headerClasses.menu}`);

    this.button?.addEventListener('click', () => {
      this.open = !this.#open;
    });

    window.addEventListener('click', this.handleWindowClick);
  }

  disconnectedCallback() {
    window.removeEventListener('click', this.handleWindowClick);
  }
}

customElements.define('dropdown-menu', DropdownMenu);
