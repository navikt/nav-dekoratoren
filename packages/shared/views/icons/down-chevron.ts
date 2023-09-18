import html from '../../html';

export function DownChevron({ className }: { className: string }) {
  return html`
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      focusable="false"
      role="img"
      aria-hidden="true"
      class="${className}"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 17.414 4.293 9.707l1.414-1.414L12 14.586l6.293-6.293 1.414 1.414L12 17.414Z"
        fill="currentColor"
      ></path>
    </svg>
  `;
}
