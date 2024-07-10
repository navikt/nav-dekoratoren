import html, { Template, htmlAttributes, unsafeHtml } from "../../html";

type IconProps = {
    className?: string;
    ariaLabel?: Template | string;
};

export const Icon =
    (icon: string) =>
    ({ ariaLabel, ...props }: IconProps = {}) => html`
        <span
            style="display: contents;"
            ${htmlAttributes({
                ariaHidden: ariaLabel ? "false" : "true",
                ...props,
            })}
            ${ariaLabel && html`aria-label="${ariaLabel}"`}
        >
            ${unsafeHtml(icon)}
        </span>
    `;
