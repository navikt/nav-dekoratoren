import html, { Template } from 'decorator-shared/html';
import cls from 'decorator-client/src/styles/sticky.module.css';

export function Sticky({ children }: { children: Template }) {
    return html`
        <d-sticky class="${cls.stickyContainer}">
            <div class="${cls.stickyPlaceholder}"></div>
            <div class="${cls.stickyContent}">${children}</div>
        </d-sticky>`;
}
