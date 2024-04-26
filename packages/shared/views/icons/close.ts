import html from "../../html";

export type CloseIconProps = {
    className?: string;
    ariaLabel?: string;
};

export function CloseIcon({ className, ariaLabel }: CloseIconProps) {
    return html`
        <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            ${ariaLabel && html`aria-label="${ariaLabel}"`}
            ${!ariaLabel && html`aria-hidden="true"`}
            focusable="false"
            role="img"
            ${className && html`class="${className}"`}
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.53 5.47a.75.75 0 0 0-1.06 1.06L10.94 12l-5.47 5.47a.75.75 0 1 0 1.06 1.06L12 13.06l5.47 5.47a.75.75 0 1 0 1.06-1.06L13.06 12l5.47-5.47a.75.75 0 0 0-1.06-1.06L12 10.94 6.53 5.47Z"
                fill="currentColor"
            ></path>
        </svg>
    `;
}
