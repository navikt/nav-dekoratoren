import cls from 'decorator-client/src/styles/sticky.module.css';

// @TODO Resizing
class Sticky extends HTMLElement {
    prevScrollOffset: number;
    stickyContent: HTMLElement;
    // The number of pixels to scroll up before showing the sticky header
    delta: number;
    // Can set this dynamically and reattach listeners
    scrollYCutOff: number;

    directionChangedPosition: number;
    prevScrollDirection: 'up' | 'down' | null;

    constructor() {
        super();
        this.prevScrollOffset = 0;
        this.delta = 20;
        this.scrollYCutOff = 80;

        this.directionChangedPosition = 0;
        this.prevScrollDirection = null;

        this.stickyContent = this.querySelector(`.${cls.stickyContent}`)!;
    }


    handleScroll = () => {
        console.log('scrolling');
        const currentScrollOffset = window.scrollY;
        const currentScrollDirection = this.prevScrollOffset > currentScrollOffset ? 'up' : 'down';

        this.prevScrollOffset = currentScrollOffset;

        if (currentScrollDirection !== this.prevScrollDirection) {
            this.prevScrollDirection = currentScrollDirection;
            this.directionChangedPosition = currentScrollOffset;
            return;
        }

        if (Math.abs(this.directionChangedPosition - currentScrollOffset) < this.delta) {
            return;
        }

        if (currentScrollOffset < this.scrollYCutOff) {
            this.stickyContent.classList.remove(cls.hidden);
            return;
        }

        if (currentScrollDirection === 'down') {
            this.stickyContent.classList.add(cls.hidden);
        } else {
            this.stickyContent.classList.remove(cls.hidden);
        }
    };

    connectedCallback() {
        // this.prevScrollOffset = window.scrollY;
        // this.style.position = 'absolute';
        this.stickyContent = this.querySelector(`.${cls.stickyContent}`)!;
        this.prevScrollOffset = window.scrollY;

        // this.handleScroll()

        window.addEventListener('scroll', this.handleScroll);

        // Wait to apply transition class
        setTimeout(() => {
            // this.stickyContent.classList.add(cls.transitioning);
        }, 30);
    }
}

customElements.define('d-sticky', Sticky);
