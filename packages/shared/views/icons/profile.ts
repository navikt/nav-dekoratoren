import { html } from 'decorator-shared/utils';

// @TODO: Should probably create a generic type for the className

export function ProfileIcon({ className }: { className: string }) {
  return html`
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      focusable="false"
      role="img"
      data-testid="minside-person"
      aria-hidden="true"
      class="${className}"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9 7a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-5a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM6 21a6 6 0 0 1 12 0v1h2v-1a8 8 0 1 0-16 0v1h2v-1Z"
        fill="currentColor"
      ></path>
    </svg>
  `;
}
