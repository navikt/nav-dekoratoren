import cls from 'decorator-client/src/styles/sticky.module.css';

// @TODO Resizing
class Sticky extends HTMLElement {
    // The number of pixels to scroll before showing/hiding the sticky header
    private readonly delta = 20;
    private readonly headerHeight = 80;

    private stickyContent: HTMLElement;

    private prevScrollOffset: number = 0;
    private offsetAtDirectionChange: number = 0;
    private prevScrollDirection: 'up' | 'down' | null = null;

    constructor() {
        super();
        this.stickyContent = this.querySelector(`.${cls.stickyContent}`)!;
    }


    private handleScroll = () => {
        const currentScrollOffset = window.scrollY;
        const currentScrollDirection = this.prevScrollOffset > currentScrollOffset ? 'up' : 'down';

        this.prevScrollOffset = currentScrollOffset;

        if (currentScrollOffset < this.headerHeight) {
            this.stickyContent.classList.remove(cls.hidden);
            return;
        }

        if (currentScrollDirection !== this.prevScrollDirection) {
            this.prevScrollDirection = currentScrollDirection;
            this.offsetAtDirectionChange = currentScrollOffset;
            return;
        }

        if (Math.abs(this.offsetAtDirectionChange - currentScrollOffset) < this.delta) {
            return;
        }

        if (currentScrollDirection === 'down') {
            this.stickyContent.classList.add(cls.hidden);
        } else {
            this.stickyContent.classList.remove(cls.hidden);
        }
    };

    private connectedCallback() {
        this.stickyContent = this.querySelector(`.${cls.stickyContent}`)!;
        this.prevScrollOffset = window.scrollY;

        window.addEventListener('scroll', this.handleScroll);
    }

    private disconnectedCallback() {
        window.removeEventListener('scroll', this.handleScroll);
    }
}

customElements.define('d-sticky', Sticky);
