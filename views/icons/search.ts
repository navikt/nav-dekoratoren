import { html } from '../../utils';

export function SearchIcon({ className = '' }: { className?: string }) {
  return html`
    <svg
      class="${className}"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
      focusable="false"
      aria-labelledby="menuSearch_:R2oti:"
      role="img"
    >
      <title id="menuSearch_:R2oti:">Søke-ikon</title>
      <circle class="menuSearch__circle" cx="10" cy="10" r="7"></circle>
      <path class="menuSearch__line-1" d="m15 15 7 7"></path>
      <path class="menuSearch__line-2" d="m15 15 7 7"></path>
      <path class="menuSearch__line-3" d="m15 15 7 7"></path>
      <path class="menuSearch__line-4" d="m15 15 7 7"></path>
    </svg>
  `;
}
