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
  return html`<li class="search-hit">
    <a href="${href}">
      <h2>${displayName}</h2>
      <p>${highlight}</p>
    </a>
  </li>`;
}
