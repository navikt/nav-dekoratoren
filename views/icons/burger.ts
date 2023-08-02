import { html } from '@/utils';

// @TODO: Should probably create a generic type for the className

export function BurgerIcon({ className }: { className: string }) {
  return html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden="true"
    focusable="false"
    aria-labelledby="menuBurger_:R2kti:"
    role="img"
    class="${className}"
  >
    <title id="menuBurger_:R2kti:">Meny-ikon</title>
    <path class="menuBurger__line-1" d="M2 4h20"></path>
    <path class="menuBurger__line-2" d="M2 12h20"></path>
    <path class="menuBurger__line-3" d="M2 20h20"></path>
  </svg>`;
}
