import { html } from '@/utils';

// @TODO: Should probably create a generic type for the className

export function VarslerIcon({ className }: { className: string }) {
  return html`<svg
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
      d="M13 2v2.07c3.392.486 6 3.404 6 6.93v1.377c0 1.303.4 2.575 1.144 3.644l1.677 2.407A1 1 0 0 1 21 20h-6a3 3 0 1 1-6 0H3a1 1 0 0 1-.82-1.572l1.676-2.407A6.377 6.377 0 0 0 5 12.377V11a7.002 7.002 0 0 1 6-6.93V2h2Zm-2 18a1 1 0 1 0 2 0h-2Zm1-14a5 5 0 0 0-5 5v1.377a8.377 8.377 0 0 1-1.503 4.787L4.915 18h14.17l-.582-.836A8.377 8.377 0 0 1 17 12.377V11a5 5 0 0 0-5-5Z"
      fill="currentColor"
    ></path>
  </svg>`;
}

export function BeskjedIcon() {
  return html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    fill="none"
  >
    <rect width="24" height="24" fill="#3380A5" rx="4" />
    <path
      fill="#fff"
      fill-rule="evenodd"
      d="M5.438 7.5c0-1.14.923-2.063 2.062-2.063h9c1.14 0 2.063.923 2.063 2.063v6.75c0 1.139-.924 2.062-2.063 2.062H9.906l-3.617 2.17A.563.563 0 0 1 5.438 18V7.5Z"
      clip-rule="evenodd"
    />
  </svg>`;
}
