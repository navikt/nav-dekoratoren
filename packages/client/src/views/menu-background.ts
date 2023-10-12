import cls from './menu-background.module.css';

class MenuBackground extends HTMLElement {
  openCount = 0;

  connectedCallback() {
    this.classList.add(cls.menuBackground);

    window.addEventListener('menuopened', () => {
      this.openCount = this.openCount + 1;
      if (this.openCount > 0) {
        this.classList.add(cls.active);
      }
    });

    window.addEventListener('menuclosed', () => {
      this.openCount = this.openCount - 1;
      if (this.openCount < 1) {
        this.classList.remove(cls.active);
      }
    });
  }
}

customElements.define('menu-background', MenuBackground);
