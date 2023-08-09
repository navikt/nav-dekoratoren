import { html } from '../utils';

export default function SearchHit({
  displayName,
  highlight,
  href,
}: {
  displayName: string;
  highlight: string;
  href: string;
}) {
  return html`<li
    class="py-4 pl-2 pr-4 hover:bg-gray-300 border-b border-b-gray-300"
  >
    <a href="${href}">
      <h2 class="text-xl font-semibold">${displayName}</h2>
      <p>${highlight}</p>
    </a>
  </li>`;
}
