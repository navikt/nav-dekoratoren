import cls from "decorator-client/src/styles/sticky.module.css";
import { defineCustomElement } from "../custom-elements";

class Sticky extends HTMLElement {
    // This element is positioned relative to the top of the document and should
    // update when the scroll position changes.
    private absoluteElement!: HTMLElement;

    // This element is nested under the absolute element, and is set to a fixed
    // position when the header is fully scrolled into view. This prevents the
    // header from sometimes moving erratically when the user is scrolling upwards.
    private fixedElement!: HTMLElement;

    // Why we use two levels of positioning in this implementation:
    // 1. Using only fixed positioning (and hiding the header with a negative top position)
    //    can cause the header to not reappear after certain DOM-mutations or various
    //    SPA behaviours. Catching every edge-case with such an implementation is tricky
    //    and would require more complexity.
    // 2. Using only absolute positioning can cause the header to "bounce" when scrolling
    //    upwards (which updates the top position), degrading the user experience.

    private menuIsOpen = false;
    private deferUpdates = false;

    private calculateAndUpdatePosition = () => {
        if (this.deferUpdates) {
            return;
        }

        const scrollPos = this.getScrollPosition();

        const newOffset = Math.min(
            Math.max(
                this.getHeaderOffset(),
                scrollPos - this.getHeaderHeight(),
            ),
            scrollPos,
        );

        this.setStickyPosition(newOffset);
    };

    private setStickyPosition = (position: number) => {
        const scrollPos = this.getScrollPosition();

        this.setFixed(position === scrollPos || this.menuIsOpen);

        this.absoluteElement.style.top = `${position}px`;

        const visibleHeight = Math.max(
            this.getHeaderHeight() + this.getHeaderOffset() - scrollPos,
            0,
        );

        // This custom property is used by consuming applications for positioning their own
        // sticky elements relative to the sticky header. It should specify the visible
        // height of the sticky header.
        // Do not change the name or value assignment of this property without notifying consumers.
        document.documentElement.style.setProperty(
            "--decorator-sticky-offset",
            `${visibleHeight}px`,
        );
    };

    private setFixed = (fixed: boolean) => {
        if (fixed) {
            this.fixedElement.classList.add(cls.fixed);
        } else {
            this.fixedElement.classList.remove(cls.fixed);
        }
    };

    // Set the header position to the top of the page and pause updates for a bit
    // to ensure the header will not overlap elements which should be visible to
    // the user.
    // TODO: replace this janky solution with a scrollend event handler when
    // browser support for this event has improved.
    private deferStickyBehaviour = () => {
        this.setStickyPosition(0);
        this.deferUpdates = true;

        setTimeout(() => {
            this.deferUpdates = false;
        }, 500);
    };

    private preventOverlapOnFocusChange = (e: FocusEvent) => {
        const targetElement = e.target as HTMLElement;
        if (!targetElement) {
            return;
        }

        // Ensure the header isn't hidden when the header itself gets focus
        const targetIsInHeader = this.fixedElement.contains(targetElement);
        if (targetIsInHeader) {
            return;
        }

        const scrollPos = this.getScrollPosition();
        const targetPos = targetElement.offsetTop;

        const targetIsOverlappedByHeader =
            targetPos >= scrollPos &&
            targetPos <= scrollPos + this.getHeaderHeight();

        if (targetIsOverlappedByHeader) {
            this.deferStickyBehaviour();
        }
    };

    private preventOverlapOnAnchorClick = (e: MouseEvent) => {
        const targetHash =
            e.target instanceof Element ? e.target.closest("a")?.hash : null;
        if (!targetHash) {
            return;
        }

        const targetElement = document.querySelector(targetHash) as HTMLElement;
        if (!targetElement) {
            return;
        }

        const scrollPos = this.getScrollPosition();
        const targetPos = targetElement.offsetTop;

        const targetIsAboveHeader =
            targetPos <= scrollPos + this.getHeaderHeight();

        if (targetIsAboveHeader) {
            this.deferStickyBehaviour();
        }
    };

    // Ensure negative scroll position is never used, which may happen on devices
    // with scroll bouncing effects
    private getScrollPosition = () => {
        return Math.max(0, window.scrollY);
    };

    private getHeaderHeight = () => {
        return this.fixedElement.clientHeight;
    };

    private getHeaderOffset = () => {
        return this.absoluteElement.offsetTop;
    };

    private onMenuOpen = () => {
        this.menuIsOpen = true;
        this.setFixed(true);
    };

    private onMenuClose = () => {
        this.menuIsOpen = false;
        this.absoluteElement.style.top = `${this.getScrollPosition()}px`;
        this.calculateAndUpdatePosition();
    };

    connectedCallback() {
        const fixedElement = this.querySelector(
            `.${cls.fixedWrapper}`,
        ) as HTMLElement | null;
        const absoluteElement = this.querySelector(
            `.${cls.absoluteWrapper}`,
        ) as HTMLElement | null;

        if (!absoluteElement || !fixedElement) {
            console.error("Required elements not found!");
            return;
        }

        this.fixedElement = fixedElement;
        this.absoluteElement = absoluteElement;

        window.addEventListener("scroll", this.calculateAndUpdatePosition);
        window.addEventListener("resize", this.calculateAndUpdatePosition);

        window.addEventListener("menuopened", this.onMenuOpen);
        window.addEventListener("menuclosed", this.onMenuClose);

        document.addEventListener("focusin", this.preventOverlapOnFocusChange);
        document.addEventListener("click", this.preventOverlapOnAnchorClick);
    }

    disconnectedCallback() {
        window.removeEventListener("scroll", this.calculateAndUpdatePosition);
        window.removeEventListener("resize", this.calculateAndUpdatePosition);

        window.removeEventListener("menuopened", this.onMenuOpen);
        window.removeEventListener("menuclosed", this.onMenuClose);

        document.removeEventListener(
            "focusin",
            this.preventOverlapOnFocusChange,
        );
        document.removeEventListener("click", this.preventOverlapOnAnchorClick);
    }
}

defineCustomElement("d-sticky", Sticky);
