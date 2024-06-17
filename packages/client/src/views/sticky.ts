import cls from "decorator-client/src/styles/sticky.module.css";

const STICKY_OFFSET_PROPERTY = "--decorator-sticky-offset";

class Sticky extends HTMLElement {
    private readonly headerElement: HTMLElement = this.querySelector(
        `.${cls.headerContent}`,
    )!;

    private scrollPos: number = 0;
    private headerVisibleHeight: number = 0;

    private isDeferringUpdates = false;

    private updateStickyPosition = () => {
        if (this.isDeferringUpdates) {
            return;
        }

        const newScrollPos = window.scrollY;
        const scrollPosDelta = newScrollPos - this.scrollPos;

        this.headerVisibleHeight = Math.max(
            Math.min(
                this.headerVisibleHeight - scrollPosDelta,
                this.getHeaderHeight(),
            ),
            0,
        );

        document.documentElement.style.setProperty(
            STICKY_OFFSET_PROPERTY,
            `${this.headerVisibleHeight}px`,
        );

        this.scrollPos = newScrollPos;
    };

    private handleOverlappingElement = (element?: HTMLElement | null) => {
        if (!element) {
            return;
        }

        const elementIsBelowHeader =
            element.offsetTop > this.scrollPos + this.headerVisibleHeight;

        if (elementIsBelowHeader) {
            return;
        }

        this.isDeferringUpdates = true;

        setTimeout(() => {
            this.isDeferringUpdates = false;
        }, 500);
    };

    private getHeaderHeight = () => {
        return this.headerElement.clientHeight;
    };

    private reset = () => {
        this.scrollPos = window.scrollY;
        this.headerVisibleHeight = this.getHeaderHeight();
        this.updateStickyPosition();
    };

    private onMenuOpen = () => {
        this.headerElement.classList.add(cls.fixed);
    };

    private onMenuClose = () => {
        this.headerElement.classList.remove(cls.fixed);
        this.reset();
    };

    private onHeaderFocus = () => {
        this.reset();
    };

    private onFocus = (e: FocusEvent) => {
        this.handleOverlappingElement(e.target as HTMLElement);
    };

    private onClick = (e: MouseEvent) => {
        const targetHash = (e.target as HTMLAnchorElement)?.hash;
        if (!targetHash) {
            return;
        }

        const targetElement = document.querySelector(targetHash) as HTMLElement;

        this.handleOverlappingElement(targetElement);
    };

    connectedCallback() {
        this.reset();

        if (!this.headerElement) {
            console.error("No header element found!");
            return;
        }

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
