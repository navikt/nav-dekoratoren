import html from '../../html';

export const PersonCircleIcon = ({ className }: { className?: string }) =>
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
      d="M12 3.75a8.25 8.25 0 0 0-5.144 14.7 5.25 5.25 0 0 1 10.288 0A8.25 8.25 0 0 0 12 3.75Zm3.747 15.602a3.75 3.75 0 0 0-7.494 0A8.215 8.215 0 0 0 12 20.25c1.35 0 2.623-.324 3.747-.898ZM2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 7.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM8.25 9.5a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0Z"
      fill="currentColor"
    ></path>
  </svg>`;
