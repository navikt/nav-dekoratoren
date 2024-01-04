import html from '../../html';

export const BriefcaseIcon = ({ className }: { className?: string } = {}) =>
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
      d="M9.25 5a.25.25 0 0 1 .25-.25h5a.25.25 0 0 1 .25.25v1.25h-5.5V5Zm-1.5 1.25V5c0-.966.784-1.75 1.75-1.75h5c.966 0 1.75.784 1.75 1.75v1.25h4.25c.69 0 1.25.56 1.25 1.25v5c0 .69-.56 1.25-1.25 1.25h-.25v4.75c0 .69-.56 1.25-1.25 1.25H5c-.69 0-1.25-.56-1.25-1.25v-4.75H3.5c-.69 0-1.25-.56-1.25-1.25v-5c0-.69.56-1.25 1.25-1.25h4.25Zm5 7.5h6v4.5H5.25v-4.5h6V15a.75.75 0 0 0 1.5 0v-1.25Zm0-2.75v1.25h7.5v-4.5H3.75v4.5h7.5V11a.75.75 0 0 1 1.5 0Z"
      fill="currentColor"
    ></path>
  </svg>`;
