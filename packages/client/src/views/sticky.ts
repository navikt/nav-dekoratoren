import cls from 'decorator-client/src/styles/sticky.module.css';

// @TODO Resizing
class Sticky extends HTMLElement {
    prevScrollOffset: number;
    stickyContent: HTMLElement;
    // The number of pixels to scroll up before showing the sticky header
    delta: number;
    // Can set this dynamically and reattach listeners
    scrollYCutOff: number;
    inProgress: boolean;
    initialized: boolean;
    isShowing: boolean;

    constructor() {
        super();
        this.prevScrollOffset = 0;
        this.delta = 40;
        this.scrollYCutOff = 160;
        this.inProgress = false;
        this.initialized = false;
        this.isShowing = false;

        this.stickyContent = this.querySelector(`.${cls.stickyContent}`)!;

        console.log(this.stickyContent);
    }


    handleScroll = () => {
        console.log('scrolling');
        const currentScrollOffset = window.scrollY;
        const isScrollingUp = this.prevScrollOffset > currentScrollOffset;


        if (window.scrollY === 0) {
            this.stickyContent.style.position = 'absolute';
            this.stickyContent.classList.remove(cls.transitioning);
        }


        if (currentScrollOffset < this.scrollYCutOff && !this.isShowing) {
            this.stickyContent.style.position = 'absolute';
        } else if (isScrollingUp) {
            this.stickyContent.style.transform = 'translateY(0)';
            this.isShowing = true;
        } else if (!isScrollingUp && currentScrollOffset > this.scrollYCutOff) {
            this.isShowing = false;
            this.stickyContent.style.transform = 'translateY(-100%)';
            this.stickyContent.style.position = 'fixed';
        }

        if (currentScrollOffset > this.scrollYCutOff && this.initialized) {
            this.stickyContent.classList.add(cls.transitioning);
        }

        this.initialized = true;
        this.prevScrollOffset = window.scrollY;
    }

    connectedCallback() {
        // this.prevScrollOffset = window.scrollY;
        // this.style.position = 'absolute';
        this.stickyContent = this.querySelector(`.${cls.stickyContent}`)!;
        this.prevScrollOffset = window.scrollY;

        window.addEventListener('scroll', this.handleScroll);

        // Wait to apply transition class
        setTimeout(() => {
            // this.stickyContent.classList.add(cls.transitioning);
        }, 30);
    }
}


customElements.define('d-sticky', Sticky);
// import React, { useEffect, useRef } from 'react';
// import { stickyScrollHandler } from 'komponenter/header/header-regular/common/sticky/StickyUtils';
// import { focusOverlapHandler } from 'komponenter/header/header-regular/common/sticky/StickyUtils';
// import { deferStickyOnAnchorLinkHandler } from 'komponenter/header/header-regular/common/sticky/StickyUtils';
// import style from './Sticky.module.scss';
//
// type Props = {
//     mobileFixed?: boolean;
//     children: JSX.Element;
// };
//
// export const Sticky = ({ mobileFixed, children }: Props) => {
//     const prevScrollOffset = useRef(0);
//     const placeholderRef = useRef<HTMLDivElement>(null);
//     const stickyRef = useRef<HTMLDivElement>(null);
//
//     useEffect(() => {
//         if (stickyRef.current) {
//             prevScrollOffset.current = window.pageYOffset;
//             stickyRef.current.style.position = 'absolute';
//         }
//     }, []);
//
//     useEffect(() => {
//         const placeholderElement = placeholderRef.current;
//         const stickyElement = stickyRef.current;
//         if (!placeholderElement || !stickyElement) {
//             return;
//         }
//
//         const setStickyOffset = stickyScrollHandler(prevScrollOffset, stickyElement, placeholderElement);
//         const deferStickyOnAnchorLinkClick = deferStickyOnAnchorLinkHandler(
//             prevScrollOffset,
//             stickyElement,
//             setStickyOffset
//         );
//         const setFocusScrollOffset = focusOverlapHandler(stickyElement);
//
//         const activateStickyHeader = () => {
//             setStickyOffset();
//             window.addEventListener('focusin', setFocusScrollOffset);
//             window.addEventListener('scroll', setStickyOffset);
//             window.addEventListener('resize', setStickyOffset);
//             window.addEventListener('click', deferStickyOnAnchorLinkClick);
//         };
//
//         if (document.readyState === 'complete') {
//             activateStickyHeader();
//         } else {
//             window.addEventListener('load', activateStickyHeader);
//         }
//
//         return () => {
//             window.removeEventListener('load', activateStickyHeader);
//             window.removeEventListener('focusin', setFocusScrollOffset);
//             window.removeEventListener('scroll', setStickyOffset);
//             window.removeEventListener('resize', setStickyOffset);
//             window.removeEventListener('click', deferStickyOnAnchorLinkClick);
//         };
//     }, []);
//
//     return (
//         <div className={style.stickyPlaceholder} ref={placeholderRef}>
//             <div
//                 className={`${style.stickyContainer} ${mobileFixed ? style.stickyContainerMobilFixed : ''}`}
//                 ref={stickyRef}
//             >
//                 {children}
//             </div>
//         </div>
//     );
// };
//
