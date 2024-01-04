import html from '../../html';

export const HomeIcon = ({ className }: { className?: string } = {}) =>
    html`<svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        focusable="false"
        aria-hidden="true"
        role="img"
        ${className && html`class="${className}"`}
    >
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M11.47 2.47a.75.75 0 0 1 1.06 0l7 7c.141.14.22.331.22.53v11a.75.75 0 0 1-.75.75h-5a.75.75 0 0 1-.75-.75v-4.25h-2.5V21a.75.75 0 0 1-.75.75H5a.75.75 0 0 1-.75-.75V10a.75.75 0 0 1 .22-.53l7-7Zm-5.72 7.84v9.94h3.5V16a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 .75.75v4.25h3.5v-9.94L12 4.06l-6.25 6.25Z"
            fill="currentColor"
        ></path>
    </svg> `;
