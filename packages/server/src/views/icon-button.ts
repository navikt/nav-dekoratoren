import html, { Template } from "decorator-shared/html";
import cls from "decorator-client/src/styles/icon-button.module.css";

export function IconButton({
    Icon,
    id,
    text,
    className,
}: {
    Icon: Template;
    id?: string;
    text: Template | string;
    className?: string;
}) {
    return html`
        <button
            ${id && html`id="${id}"`}
            class="${cls.iconButton} ${className}"
        >
            ${Icon}
            <span class="${cls.iconButtonSpan}">${text}</span>
        </button>
    `;
}

// @TODO: Research how it's done in Aksel
export function AnchorIconButton({
    Icon,
    text,
    className,
    href,
}: {
    Icon: Template;
    text: Template | string;
    className?: string;
    href: string;
}) {
    return html`
        <a
            class="${cls.iconButton} ${cls.anchorIconButton} ${className}"
            href="${href}"
        >
            ${Icon}
            <span class="${cls.iconButtonSpan}">${text}</span>
        </a>
    `;
}
