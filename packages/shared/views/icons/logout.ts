import html from 'decorator-shared/html';

// @TODO: Should probably create a generic type for the className

export function LogoutIcon({ className }: { className?: string }) {
  return html`<svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    focusable="false"
    aria-hidden="true"
    role="img"
    class="${className}"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M3.25 5c0-.966.784-1.75 1.75-1.75h3.5a.75.75 0 0 1 0 1.5H5a.25.25 0 0 0-.25.25v14c0 .138.112.25.25.25h3.5a.75.75 0 0 1 0 1.5H5A1.75 1.75 0 0 1 3.25 19V5Zm4.5 7a.75.75 0 0 1 .75-.75h9.69l-3.22-3.22a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H8.5a.75.75 0 0 1-.75-.75Z"
      fill="currentColor"
    ></path>
  </svg>`;
}
