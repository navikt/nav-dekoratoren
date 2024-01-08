import html from '../../html';

export const BadgeIcon = ({ className }: { className?: string } = {}) =>
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
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10 4.25a.75.75 0 0 0-.75.75v1.25H3a.75.75 0 0 0-.75.75v12c0 .414.336.75.75.75h18a.75.75 0 0 0 .75-.75V7a.75.75 0 0 0-.75-.75h-6.25V5a.75.75 0 0 0-.75-.75h-4Zm3.25 2v-.5h-2.5v.5h2.5ZM10 7.75H3.75v10.5h16.5V7.75H10ZM5.25 10A.75.75 0 0 1 6 9.25h3a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75v-6Zm1.5.75v4.5h1.5v-4.5h-1.5ZM12 9.25a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-6ZM11.25 13a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-6Z"
            fill="currentColor"
        ></path>
    </svg>`;
