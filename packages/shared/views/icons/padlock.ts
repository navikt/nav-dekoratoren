import html from '../../html';

export const PadlockIcon = ({ className }: { className?: string }) =>
  html`<svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    focusable="false"
    role="img"
    ${className && html`class="${className}"`}
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12 2.25A4.75 4.75 0 0 0 7.25 7v2.25H7A1.75 1.75 0 0 0 5.25 11v9c0 .414.336.75.75.75h12a.75.75 0 0 0 .75-.75v-9A1.75 1.75 0 0 0 17 9.25h-.25V7A4.75 4.75 0 0 0 12 2.25Zm3.25 7V7a3.25 3.25 0 0 0-6.5 0v2.25h6.5ZM6.75 11a.25.25 0 0 1 .25-.25h10a.25.25 0 0 1 .25.25v8.25H6.75V11ZM12 13a1.5 1.5 0 0 0-.75 2.8V17a.75.75 0 0 0 1.5 0v-1.2A1.5 1.5 0 0 0 12 13Z"
      fill="currentColor"
    ></path>
  </svg>`;
