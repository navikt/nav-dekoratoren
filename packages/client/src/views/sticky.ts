import cls from 'decorator-client/src/styles/sticky.module.css';

const STICKY_OFFSET_PROPERTY = '--decorator-sticky-offset';
const STICKY_TRIGGER_DELTA_PX = 20;
const HEADER_HEIGHT_PX = 80;

// @TODO Resizing
class Sticky extends HTMLElement {
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

        if (currentScrollOffset < HEADER_HEIGHT_PX) {
            if (currentScrollDirection === 'down') {
                this.dock();
            }
            return;
        }

        if (currentScrollDirection !== this.prevScrollDirection) {
            this.prevScrollDirection = currentScrollDirection;
            this.offsetAtDirectionChange = currentScrollOffset;
            return;
        }

        if (Math.abs(this.offsetAtDirectionChange - currentScrollOffset) < STICKY_TRIGGER_DELTA_PX) {
            return;
        }

        if (currentScrollDirection === 'down') {
            this.unstick();
        } else {
            this.stick();
        }
    };

    private dock() {
        this.stickyContent.classList.remove(cls.hidden);
        this.stickyContent.classList.remove(cls.sticky);
        document.documentElement.style.setProperty(STICKY_OFFSET_PROPERTY, '0px');
    }

    private stick() {
        this.stickyContent.classList.remove(cls.hidden);
        this.stickyContent.classList.add(cls.sticky);
        document.documentElement.style.setProperty(STICKY_OFFSET_PROPERTY, `${HEADER_HEIGHT_PX}px`);
    }

    private unstick() {
        this.stickyContent.classList.add(cls.hidden);
        document.documentElement.style.setProperty(STICKY_OFFSET_PROPERTY, '0px');
    }

    private init() {
        const currentScrollOffset = window.scrollY;
        this.prevScrollOffset = currentScrollOffset;

        if (currentScrollOffset < HEADER_HEIGHT_PX) {
            this.stick();
        } else {
            this.unstick();
        }
    }

    private connectedCallback() {
        this.stickyContent = this.querySelector(`.${cls.stickyContent}`)!;
        this.prevScrollOffset = window.scrollY;
        this.init();

        window.addEventListener('scroll', this.handleScroll);
    }

    private disconnectedCallback() {
        window.removeEventListener('scroll', this.handleScroll);
    }
}

customElements.define('d-sticky', Sticky);
