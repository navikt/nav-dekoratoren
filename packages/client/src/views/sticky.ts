import cls from "decorator-client/src/styles/sticky.module.css";

const STICKY_OFFSET_PROPERTY = "--decorator-sticky-offset";

class Sticky extends HTMLElement {
    private readonly headerElement: HTMLElement;

    private scrollPos: number = 0;
    private headerVisibleHeight: number = 0;

    constructor() {
        super();

        this.headerElement = this.querySelector(`.${cls.headerContent}`)!;

        if (!this.headerElement) {
            console.error("No header element found!");
        }

        this.reset();
    }

    private updateStickyPosition = () => {
        const newScrollPos = window.scrollY;
        const scrollPosDelta = newScrollPos - this.scrollPos;

        const headerContentHeight = this.headerElement.clientHeight;

        this.headerVisibleHeight = Math.max(
            Math.min(
                this.headerVisibleHeight + scrollPosDelta,
                headerContentHeight,
            ),
            0,
        );

        console.log(`Current visible height: ${this.headerVisibleHeight}`);

        document.documentElement.style.setProperty(
            STICKY_OFFSET_PROPERTY,
            `${headerContentHeight - this.headerVisibleHeight}px`,
        );

        this.scrollPos = newScrollPos;
    };

    private reset = () => {
        this.scrollPos = window.scrollY;
        this.headerVisibleHeight = 0;
    };

    private setFixed = () => {
        this.headerElement.classList.add(cls.fixed);
    };

    private setSticky = () => {
        this.headerElement.classList.remove(cls.fixed);
        this.reset();
        this.updateStickyPosition();
    };

    connectedCallback() {
        this.updateStickyPosition();

        window.addEventListener("scroll", this.updateStickyPosition);
        window.addEventListener("resize", this.updateStickyPosition);
        window.addEventListener("menuopened", this.setFixed);
        window.addEventListener("menuclosed", this.setSticky);
    }

    disconnectedCallback() {
        window.removeEventListener("scroll", this.updateStickyPosition);
        window.removeEventListener("resize", this.updateStickyPosition);
        window.removeEventListener("menuopened", this.setFixed);
        window.removeEventListener("menuclosed", this.setSticky);
    }
}

customElements.define("d-sticky", Sticky);
