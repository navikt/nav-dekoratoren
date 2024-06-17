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

    private onMenuOpen = () => {
        this.headerElement.classList.add(cls.fixed);
    };

    private onMenuClose = () => {
        this.headerElement.classList.remove(cls.fixed);
        this.reset();
        this.updateStickyPosition();
    };

    private onHeaderFocus = () => {
        this.reset();
        this.updateStickyPosition();
    };

    private onFocus = (e: FocusEvent) => {
        this.handleOverlappingElement(e.target);
    };

    private onClick = (e: MouseEvent) => {
        const targetHash = e.target?.hash;
        if (!targetHash) {
            return;
        }

        const targetElement = document.querySelector(targetHash) as HTMLElement;

        this.handleOverlappingElement(targetElement);
    };

    private handleOverlappingElement = (element?: HTMLElement) => {
        if (!element) {
            return;
        }

        const elementIsBelowHeader =
            element.offsetTop > this.scrollPos + this.headerVisibleHeight;

        if (elementIsBelowHeader) {
            return;
        }

        window.removeEventListener("scroll", this.updateStickyPosition);
        setTimeout(
            () => window.addEventListener("scroll", this.updateStickyPosition),
            500,
        );
    };

    connectedCallback() {
        this.updateStickyPosition();

        window.addEventListener("scroll", this.updateStickyPosition);
        window.addEventListener("resize", this.updateStickyPosition);
        window.addEventListener("menuopened", this.onMenuOpen);
        window.addEventListener("menuclosed", this.onMenuClose);
        document.addEventListener("click", this.onClick);
        document.addEventListener("focusin", this.onFocus);
        this.headerElement.addEventListener("focusin", this.onHeaderFocus);
    }

    disconnectedCallback() {
        window.removeEventListener("scroll", this.updateStickyPosition);
        window.removeEventListener("resize", this.updateStickyPosition);
        window.removeEventListener("menuopened", this.onMenuOpen);
        window.removeEventListener("menuclosed", this.onMenuClose);
        document.removeEventListener("click", this.onClick);
        document.removeEventListener("focusin", this.onFocus);
        this.headerElement.removeEventListener("focusin", this.onHeaderFocus);
    }
}

customElements.define("d-sticky", Sticky);
