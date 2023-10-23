import cls from '../styles/dropdown-menu.module.css';

class DropdownMenu extends HTMLElement {
  button: HTMLElement | null = null;
  #open: boolean = false;

  handleWindowClick = (e: MouseEvent) => {
    if (!this.contains(e.target as Node)) {
      this.open = false;
    }
  };

  set open(open: boolean) {
    if (open !== this.#open) {
      this.classList.toggle(cls.dropdownMenuOpen, open);
      if (!this.button?.getAttribute('aria-expanded')) {
        this.button?.setAttribute('aria-expanded', 'true');
      } else {
        this.button?.removeAttribute('aria-expanded');
      }
      this.#open = open;
      this.dispatchEvent(
        new Event(open ? 'menuopened' : 'menuclosed', { bubbles: true }),
      );
    }
  }

  connectedCallback() {
    this.button = this.querySelector(':scope > button');

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
