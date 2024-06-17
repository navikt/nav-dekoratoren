import cls from "decorator-client/src/styles/sticky.module.css";

const STICKY_OFFSET_PROPERTY = "--decorator-sticky-offset";
const HEADER_HEIGHT_PX = 80;

class Sticky extends HTMLElement {
    private readonly contentElement: HTMLElement;

    private prevScrollPos: number;
    private currentStickyOffset: number = 0;

    constructor() {
        super();

        this.contentElement = this.querySelector(`.${cls.stickyContent}`)!;

        if (!this.contentElement) {
            console.error("No content element found!");
        }

        this.prevScrollPos = window.scrollY;
    }

    private updateStickyPosition = () => {
        const currentScrollPos = window.scrollY;
        const scrollPosDelta = currentScrollPos - this.prevScrollPos;

        const newOffset = this.currentStickyOffset + scrollPosDelta;

        this.currentStickyOffset = Math.max(
            Math.min(newOffset, HEADER_HEIGHT_PX),
            0,
        );

        console.log(`Current offset: ${this.currentStickyOffset}`);

        document.documentElement.style.setProperty(
            STICKY_OFFSET_PROPERTY,
            `${this.currentStickyOffset}px`,
        );

        this.prevScrollPos = currentScrollPos;
    };

    connectedCallback() {
        this.updateStickyPosition();

        window.addEventListener("scroll", this.updateStickyPosition);
    }

    disconnectedCallback() {
        window.removeEventListener("scroll", this.updateStickyPosition);
    }
}

customElements.define("d-sticky", Sticky);
