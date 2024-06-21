import html from "../../html";

export function ArrowRight({ className }: { className?: string }) {
    return html`
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
            role="img"
            aria-hidden="true"
            ${className && html`class="${className}"`}
        >
            <title id="arrow-to-more-search-hits">pil-opp-ikon</title>
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M14.087 6.874a.752.752 0 0 0-.117 1.156l3.22 3.22H5a.75.75 0 0 0 0 1.5h12.19l-3.22 3.22a.75.75 0 0 0 1.06 1.06l4.5-4.5a.75.75 0 0 0 0-1.06l-4.5-4.5a.75.75 0 0 0-.943-.096"
                fill="currentColor"
            ></path>
        </svg>
    `;
}
