import cls from "decorator-client/src/styles/sticky.module.css";

const STICKY_OFFSET_PROPERTY = "--decorator-sticky-offset";

class Sticky extends HTMLElement {
    private readonly stickyElement: HTMLElement = this.querySelector(
        `.${cls.stickyWrapper}`,
    )!;
    private readonly fixedElement: HTMLElement = this.querySelector(
        `.${cls.fixedWrapper}`,
    )!;

    private fixedLocked = false;
    private deferredUpdate = false;

    private updateStickyPosition = () => {
        if (this.deferredUpdate) {
            return;
        }

        const currentTop = this.stickyElement.offsetTop;
        const headerHeight = this.fixedElement.clientHeight;
        const scrollPos = window.scrollY;

        const newTop = Math.min(
            Math.max(currentTop, scrollPos - headerHeight),
            scrollPos,
        );

        console.log(
            `Current top ${currentTop} - New top ${newTop} - Scroll ${scrollPos} - Height ${headerHeight}`,
        );

        this.setStickyPosition(newTop);
    };

    private setStickyPosition = (position: number) => {
        const scrollPos = window.scrollY;
        const headerHeight = this.fixedElement.clientHeight;

        this.setFixed(position === scrollPos);

        this.stickyElement.style.top = `${position}px`;

        const visibleHeight = Math.max(
            headerHeight + this.stickyElement.offsetTop - scrollPos,
            0,
        );

        document.documentElement.style.setProperty(
            STICKY_OFFSET_PROPERTY,
            `${visibleHeight}px`,
        );
    };

    private setFixed = (fixed: boolean) => {
        if (fixed || this.fixedLocked) {
            console.log("Setting fixed");
            this.fixedElement.classList.add(cls.fixed);
        } else {
            this.fixedElement.classList.remove(cls.fixed);
        }
    };

    private handleOverlappingElement = (element?: HTMLElement | null) => {
        if (!element) {
            return;
        }

        const elementIsBelowHeader =
            element.offsetTop > window.scrollY + this.fixedElement.clientHeight;

        console.log(
            `Overlap check ${element.offsetTop} - ${this.stickyElement.offsetTop} - ${this.fixedElement.clientHeight}`,
            element,
        );

        if (elementIsBelowHeader) {
            return;
        }

        this.setStickyPosition(0);
        this.deferredUpdate = true;

        // TODO: replace this janky solution with a scrollend handler when browser support has improvoed
        setTimeout(() => {
            this.deferredUpdate = false;
        }, 500);
    };

    private onMenuOpen = () => {
        this.fixedLocked = true;
        this.setFixed(true);
    };

    private onMenuClose = () => {
        this.fixedLocked = false;
        this.stickyElement.style.top = `${window.scrollY}px`;
        this.updateStickyPosition();
    };

    private onFocus = (e: FocusEvent) => {
        const isHeader = e
            .composedPath?.()
            ?.some((path) =>
                (path as HTMLElement)?.className?.includes(cls.fixedWrapper),
            );

        if (isHeader) {
            console.log("Focused header");
            return;
        }

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
        if (!this.stickyElement) {
            console.error("No sticky element found!");
            return;
        }

        window.addEventListener("scroll", this.updateStickyPosition);
        window.addEventListener("resize", this.updateStickyPosition);

        window.addEventListener("menuopened", this.onMenuOpen);
        window.addEventListener("menuclosed", this.onMenuClose);

        document.addEventListener("focusin", this.onFocus);
        document.addEventListener("click", this.onClick);
    }

    disconnectedCallback() {
        window.removeEventListener("scroll", this.updateStickyPosition);
        window.removeEventListener("resize", this.updateStickyPosition);

        window.removeEventListener("menuopened", this.onMenuOpen);
        window.removeEventListener("menuclosed", this.onMenuClose);

        document.removeEventListener("focusin", this.onFocus);
        document.removeEventListener("click", this.onClick);
    }
}

customElements.define("d-sticky", Sticky);
