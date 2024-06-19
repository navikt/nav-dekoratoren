import cls from "decorator-client/src/styles/sticky.module.css";

const STICKY_OFFSET_PROPERTY = "--decorator-sticky-offset";

class Sticky extends HTMLElement {
    private readonly stickyElement: HTMLElement = this.querySelector(
        `.${cls.stickyWrapper}`,
    )!;

    private prevScrollPos: number = 0;
    private prevScrollDir: "up" | "down" | null = null;

    private headerVisibleHeight: number = 0;
    private isDeferringUpdates = false;

    private updateStickyPosition = () => {
        document.documentElement.style.setProperty(
            STICKY_OFFSET_PROPERTY,
            `${this.headerVisibleHeight}px`,
        );
    };

    private onScrollDown = () => {
        const scrollDelta = window.scrollY - this.prevScrollPos;
        this.headerVisibleHeight = Math.min(
            Math.max(this.headerVisibleHeight + scrollDelta, 0),
            this.getHeaderHeight(),
        );
    };

    private onScrollUp = () => {
        const currentTop = this.stickyElement.offsetTop;

        const stickyTop = Math.min(
            Math.max(currentTop, window.scrollY - this.getHeaderHeight()),
            window.scrollY,
        );

        console.log(
            `Current top ${currentTop} - New top ${stickyTop} - Scroll ${window.scrollY} - Height ${this.getHeaderHeight()}`,
        );

        this.stickyElement.style.top = `${stickyTop}px`;
    };

    private onScroll = () => {
        const scrollPos = window.scrollY;

        const scrollDir = scrollPos > this.prevScrollPos ? "down" : "up";

        if (scrollDir === "down") {
            this.onScrollDown();
        } else {
            this.onScrollUp();
        }

        this.prevScrollPos = scrollPos;
        this.prevScrollDir = scrollDir;
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

    private reset = (position = window.scrollY) => {
        this.prevScrollPos = position;
        this.headerVisibleHeight = this.getHeaderHeight();
    };

    private onMenuOpen = () => {
        this.stickyElement.classList.add(cls.fixed);
    };

    private onMenuClose = () => {
        this.stickyElement.classList.remove(cls.fixed);
        this.reset();
    };

    private onHeaderFocus = () => {
        this.reset();
    };

    private onFocus = (e: FocusEvent) => {
        this.handleOverlappingElement(e.target as HTMLElement);
    };

    private onHistoryPush = () => {
        this.updateStickyPosition();
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

        if (!this.stickyElement) {
            console.error("No header element found!");
            return;
        }

        window.addEventListener("scroll", this.onScroll);

        // window.addEventListener("scroll", this.updateStickyPosition);
        // window.addEventListener("resize", this.updateStickyPosition);

        // window.addEventListener("menuopened", this.onMenuOpen);
        // window.addEventListener("menuclosed", this.onMenuClose);
        // window.addEventListener("historyPush", this.onHistoryPush);
        //
        // document.addEventListener("click", this.onClick);
        // document.addEventListener("focusin", this.onFocus);
        // this.headerElement.addEventListener("focusin", this.onHeaderFocus);
    }

    disconnectedCallback() {
        window.removeEventListener("scroll", this.onScroll);

        // window.removeEventListener("scroll", this.updateStickyPosition);
        // window.removeEventListener("resize", this.updateStickyPosition);

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
