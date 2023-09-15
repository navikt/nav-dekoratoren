import { html, spreadProps } from 'decorator-shared/utils';

export function BackChevron(props?: { className?: string }) {
  return html`
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      focusable="false"
      role="img"
      aria-hidden="true"
      ${spreadProps({
        class: props?.className,
      })}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="m6.586 12 7.707-7.707 1.414 1.414L9.414 12l6.293 6.293-1.414 1.414L6.586 12Z"
        fill="currentColor"
      ></path>
    </svg>
  `;
}
