import html from "../../html";

export const Buildings3Icon = ({ className }: { className?: string } = {}) =>
    html`<svg
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        aria-hidden="true"
        role="img"
        ${className && html`class="${className}"`}
    >
        <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M6.25 3A.75.75 0 0 1 7 2.25h10a.75.75 0 0 1 .75.75v6.25H21a.75.75 0 0 1 .75.75v11a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75V10A.75.75 0 0 1 3 9.25h3.25zm11.5 17.25v-9.5h2.5v9.5zm-1.5-16.5v16.5h-8.5V3.75zm-10 7v9.5h-2.5v-9.5zm3.75-5a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75m3 0a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75m-2.25 6.75a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0zm2.25-.75a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75"
            clip-rule="evenodd"
        ></path>
    </svg>`;
