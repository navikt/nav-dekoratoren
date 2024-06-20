import cls from "decorator-client/src/styles/sticky.module.css";

const STICKY_OFFSET_PROPERTY = "--decorator-sticky-offset";

class Sticky extends HTMLElement {
    private readonly outerElement: HTMLElement = this.querySelector(
        `.${cls.stickyWrapper}`,
    )!;
    private readonly innerElement: HTMLElement = this.querySelector(
        `.${cls.fixedWrapper}`,
    )!;

    private fixedLocked = false;
    private deferredUpdate = false;

    private updateStickyPosition = () => {
        if (this.deferredUpdate) {
            return;
        }

        const currentTop = this.outerElement.offsetTop;
        const headerHeight = this.innerElement.clientHeight;
        const scrollPos = window.scrollY;

        const newTop = Math.min(
            Math.max(currentTop, scrollPos - headerHeight),
            scrollPos,
        );

        this.setStickyPosition(newTop);
    };

    private setStickyPosition = (position: number) => {
        const scrollPos = window.scrollY;
        const headerHeight = this.innerElement.clientHeight;

        this.setFixed(position === scrollPos);

        this.outerElement.style.top = `${position}px`;

        const visibleHeight = Math.max(
            headerHeight + this.outerElement.offsetTop - scrollPos,
            0,
        );

        document.documentElement.style.setProperty(
            STICKY_OFFSET_PROPERTY,
            `${visibleHeight}px`,
        );
    };

    private setFixed = (fixed: boolean) => {
        if (fixed || this.fixedLocked) {
            this.innerElement.classList.add(cls.fixed);
        } else {
            this.innerElement.classList.remove(cls.fixed);
        }
    };

    private deferStickyBehaviour = () => {
        this.setStickyPosition(0);
        this.deferredUpdate = true;

        // TODO: replace this janky solution with a scrollend handler when browser support has improved
        setTimeout(() => {
            this.deferredUpdate = false;
        }, 500);
    };

    private preventOverlapOnFocusChange = (e: FocusEvent) => {
        const isWithinSticky = e
            .composedPath?.()
            ?.some((path) =>
                (path as HTMLElement)?.className?.includes(cls.fixedWrapper),
            );

        if (isWithinSticky) {
            return;
        }

        const targetElement = e.target as HTMLElement;
        if (!targetElement) {
            return;
        }

        const scrollPos = window.scrollY;
        const targetPos = targetElement.offsetTop;
        const headerHeight = this.innerElement.clientHeight;

        const targetIsInHeaderArea =
            targetPos >= scrollPos && targetPos <= scrollPos + headerHeight;

        if (targetIsInHeaderArea) {
            this.deferStickyBehaviour();
        }
    };

    private preventOverlapOnAnchorClick = (e: MouseEvent) => {
        const targetHash = (e.target as HTMLAnchorElement)?.hash;
        if (!targetHash) {
            return;
        }

        const targetElement = document.querySelector(targetHash) as HTMLElement;
        if (!targetElement) {
            return;
        }

        const scrollPos = window.scrollY;
        const targetPos = targetElement.offsetTop;
        const headerHeight = this.innerElement.clientHeight;

        const targetIsAboveHeader = targetPos <= scrollPos + headerHeight;

        if (targetIsAboveHeader) {
            this.deferStickyBehaviour();
        }
    };

    private onMenuOpen = () => {
        this.fixedLocked = true;
        this.setFixed(true);
    };

    private onMenuClose = () => {
        this.fixedLocked = false;
        this.outerElement.style.top = `${window.scrollY}px`;
        this.updateStickyPosition();
    };

    connectedCallback() {
        if (!this.outerElement) {
            console.error("No sticky element found!");
            return;
        }

        window.addEventListener("scroll", this.updateStickyPosition);
        window.addEventListener("resize", this.updateStickyPosition);

        window.addEventListener("menuopened", this.onMenuOpen);
        window.addEventListener("menuclosed", this.onMenuClose);

        document.addEventListener("focusin", this.preventOverlapOnFocusChange);
        document.addEventListener("click", this.preventOverlapOnAnchorClick);
    }

    disconnectedCallback() {
        window.removeEventListener("scroll", this.updateStickyPosition);
        window.removeEventListener("resize", this.updateStickyPosition);

        window.removeEventListener("menuopened", this.onMenuOpen);
        window.removeEventListener("menuclosed", this.onMenuClose);

        document.removeEventListener(
            "focusin",
            this.preventOverlapOnFocusChange,
        );
        document.removeEventListener("click", this.preventOverlapOnAnchorClick);
    }
}

customElements.define("d-sticky", Sticky);
