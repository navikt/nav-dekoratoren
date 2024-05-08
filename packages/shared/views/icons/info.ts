import html from "../../html";

export const InfoIcon = ({ className }: { className?: string } = {}) =>
    html`<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        focusable="false"
        aria-hidden="true"
        role="img"
        ${className && html`class="${className}"`}
    >
        <path
            fill="currentColor"
            d="M12 0a12 12 0 1 1 0 24 12 12 0 0 1 0-24Zm0 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM9 19v-2h2v-5H9v-2h4v7h2v2H9Zm3-14a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
        />
    </svg>`;
