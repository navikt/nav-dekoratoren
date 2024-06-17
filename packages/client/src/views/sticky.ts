import cls from "decorator-client/src/styles/sticky.module.css";

const STICKY_OFFSET_PROPERTY = "--decorator-sticky-offset";

class Sticky extends HTMLElement {
    private readonly contentElement: HTMLElement;

    private scrollPos: number;
    private stickyOffset: number = 0;

    constructor() {
        super();

        this.contentElement = this.querySelector(`.${cls.stickyContent}`)!;

        if (!this.contentElement) {
            console.error("No content element found!");
        }

        this.scrollPos = window.scrollY;
    }

    private updateStickyPosition = () => {
        const newScrollPos = window.scrollY;
        const scrollPosDelta = newScrollPos - this.scrollPos;

        this.stickyOffset = Math.max(
            Math.min(
                this.stickyOffset + scrollPosDelta,
                this.contentElement.clientHeight,
                newScrollPos,
            ),
            0,
        );

        console.log(`Current offset: ${this.stickyOffset}`);

        document.documentElement.style.setProperty(
            STICKY_OFFSET_PROPERTY,
            `${this.stickyOffset}px`,
        );

        this.scrollPos = newScrollPos;
    };

    connectedCallback() {
        this.updateStickyPosition();

        window.addEventListener("scroll", this.updateStickyPosition);
        window.addEventListener("resize", this.updateStickyPosition);
    }

    disconnectedCallback() {
        window.removeEventListener("scroll", this.updateStickyPosition);
        window.removeEventListener("resize", this.updateStickyPosition);
    }
}

customElements.define("d-sticky", Sticky);
