import cls from './menu-background.module.css';

class MenuBackground extends HTMLElement {
  connectedCallback() {
    this.classList.add(cls.menuBackground);

    window.addEventListener('menuopened', () => {
      this.classList.add(cls.active);
    });

    window.addEventListener('menuclosed', () => {
      this.classList.remove(cls.active);
    });
  }
}

customElements.define('menu-background', MenuBackground);
