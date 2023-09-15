import html from 'decorator-shared/html';

// @TODO: Should probably create a generic type for the className

export function LoginIcon({ className }: { className: string }) {
  return html`<svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    focusable="false"
    role="img"
    aria-labelledby="decorator-login-icon"
    aria-hidden="true"
    class="${className}"
  >
    <title id="decorator-login-icon">Logginn-ikon</title>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M19 4h-5V2h5a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3h-5v-2h5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Zm-8.293 2.293L16.414 12l-5.707 5.707-1.414-1.414L12.586 13H2v-2h10.586L9.293 7.707l1.414-1.414Z"
      fill="currentColor"
    ></path>
  </svg>`;
}
