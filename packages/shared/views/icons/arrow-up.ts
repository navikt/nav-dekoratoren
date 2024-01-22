import html from '../../html';

export function ArrowUp({ className }: { className?: string }) {
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
            <title id="footer-til-toppen-ikon">pil-opp-ikon</title>
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="m12 1.586 7.707 7.707-1.414 1.414L13 5.414V22h-2V5.414l-5.293 5.293-1.414-1.414L12 1.586Z"
                fill="currentColor"
            ></path>
        </svg>
    `;
}
