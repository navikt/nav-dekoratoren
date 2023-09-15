import { html, spreadProps } from 'decorator-shared/utils';

export function ForwardChevron(props?: { className?: string }) {
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
        d="m17.414 12-7.707 7.707-1.414-1.414L14.586 12 8.293 5.707l1.414-1.414L17.414 12Z"
        fill="currentColor"
      ></path>
    </svg>
  `;
}
