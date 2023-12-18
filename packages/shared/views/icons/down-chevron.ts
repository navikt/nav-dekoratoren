import html from '../../html';

export const DownChevronIcon = ({
  className,
}: { className?: string } = {}) => html`
  <svg
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
      d="M5.97 9.47a.75.75 0 0 1 1.06 0L12 14.44l4.97-4.97a.75.75 0 1 1 1.06 1.06l-5.5 5.5a.75.75 0 0 1-1.06 0l-5.5-5.5a.75.75 0 0 1 0-1.06Z"
      fill="currentColor"
    ></path>
  </svg>
`;
