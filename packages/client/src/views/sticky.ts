import cls from "decorator-client/src/styles/sticky.module.css";

const STICKY_OFFSET_PROPERTY = "--decorator-sticky-offset";

class Sticky extends HTMLElement {
    private readonly stickyElement: HTMLElement = this.querySelector(
        `.${cls.stickyWrapper}`,
    )!;

    private prevScrollPos = window.scrollY;
    private isDeferringUpdates = false;

    private updateStickyPosition = () => {
        const currentTop = this.stickyElement.offsetTop;

        const newTop = Math.min(
            Math.max(currentTop, window.scrollY - this.getHeaderHeight()),
            window.scrollY,
        );

        console.log(
            `Current top ${currentTop} - New top ${newTop} - Scroll ${window.scrollY} - Height ${this.getHeaderHeight()}`,
        );

        this.stickyElement.style.top = `${newTop}px`;
    };

    private updateOffsetProperty = () => {
        const visibleHeight = Math.max(
            this.getHeaderHeight() +
                this.stickyElement.offsetTop -
                window.scrollY,
            0,
        );

        document.documentElement.style.setProperty(
            STICKY_OFFSET_PROPERTY,
            `${visibleHeight}px`,
        );
    };

    private update = () => {
        const scrollPos = window.scrollY;

        const isScrollingUp = scrollPos < this.prevScrollPos;

        if (isScrollingUp) {
            this.updateStickyPosition();
        }

        this.updateOffsetProperty();
        this.prevScrollPos = scrollPos;
    };

    private handleOverlappingElement = (element?: HTMLElement | null) => {
        if (!element) {
            return;
        }

        const elementIsBelowHeader =
            element.offsetTop > this.prevScrollPos + this.headerVisibleHeight;

        if (elementIsBelowHeader) {
            return;
        }

        this.isDeferringUpdates = true;

        setTimeout(() => {
            this.isDeferringUpdates = false;
        }, 500);
    };

    private getHeaderHeight = () => {
        return this.stickyElement.clientHeight;
    };

    private onMenuOpen = () => {
        this.stickyElement.classList.add(cls.fixed);
    };

    private onMenuClose = () => {
        this.stickyElement.classList.remove(cls.fixed);
    };

    private onHeaderFocus = () => {};

    private onFocus = (e: FocusEvent) => {
        this.handleOverlappingElement(e.target as HTMLElement);
    };

    private onHistoryPush = () => {};

    private onClick = (e: MouseEvent) => {
        const targetHash = (e.target as HTMLAnchorElement)?.hash;
        if (!targetHash) {
            return;
        }

        const targetElement = document.querySelector(targetHash) as HTMLElement;

        this.handleOverlappingElement(targetElement);
    };

    connectedCallback() {
        if (!this.stickyElement) {
            console.error("No sticky element found!");
            return;
        }

        window.addEventListener("scroll", this.update);
        window.addEventListener("resize", this.update);

        // window.addEventListener("menuopened", this.onMenuOpen);
        // window.addEventListener("menuclosed", this.onMenuClose);
        // window.addEventListener("historyPush", this.onHistoryPush);
        //
        // document.addEventListener("click", this.onClick);
        // document.addEventListener("focusin", this.onFocus);
        // this.headerElement.addEventListener("focusin", this.onHeaderFocus);
    }

    disconnectedCallback() {
        window.removeEventListener("scroll", this.update);
        window.removeEventListener("resize", this.update);

        // window.removeEventListener("menuopened", this.onMenuOpen);
        // window.removeEventListener("menuclosed", this.onMenuClose);
        // window.removeEventListener("historyPush", this.onHistoryPush);
        //
        // document.removeEventListener("click", this.onClick);
        // document.removeEventListener("focusin", this.onFocus);
        // this.headerElement.removeEventListener("focusin", this.onHeaderFocus);
    }
}

customElements.define("d-sticky", Sticky);
