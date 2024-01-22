import cls from './menu-background.module.css';

class MenuBackground extends HTMLElement {
    openCount = 0;

    connectedCallback() {
        this.classList.add(cls.menuBackground);

        window.addEventListener('menuopened', () => {
            this.openCount = this.openCount + 1;
            if (this.openCount > 0) {
                this.classList.add(cls.active);
                document.body.classList.add(cls.menuOpenBody);
            }
        });

        window.addEventListener('menuclosed', () => {
            this.openCount = this.openCount - 1;
            if (this.openCount < 1) {
                this.classList.remove(cls.active);
                document.body.classList.remove(cls.menuOpenBody);
            }
        });
    }
}

customElements.define('menu-background', MenuBackground);
