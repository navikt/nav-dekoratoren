import cls from "decorator-client/src/styles/sticky.module.css";

const STICKY_OFFSET_PROPERTY = "--decorator-sticky-offset";
const HEADER_HEIGHT_PX = 80;

class Sticky extends HTMLElement {
    private stickyContent: HTMLElement;
    private stickyWrapper: HTMLElement;

    constructor() {
        super();

        this.stickyContent = this.querySelector(`.${cls.stickyContent}`)!;
        this.stickyWrapper = this.querySelector(`.${cls.stickyWrapper}`)!;
    }

    private setStickyOffsetProperty(offset: number) {
        document.documentElement.style.setProperty(
            STICKY_OFFSET_PROPERTY,
            `${offset}px`,
        );
    }

    private updateStickyPosition() {}

    private connectedCallback() {
        this.updateStickyPosition();

        window.addEventListener("scroll", this.updateStickyPosition);
    }

    private disconnectedCallback() {
        window.removeEventListener("scroll", this.updateStickyPosition);
    }
}

customElements.define("d-sticky", Sticky);
