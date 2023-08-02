import { html } from '../utils';

export default function SearchHit({
  displayName,
  hightlight,
  href,
}: {
  displayName: string;
  hightlight: string;
  href: string;
}) {
  return html`<li>
    <a href="${href}">
      <h2>${displayName}</h2>
      <p>${hightlight}</p>
    </a>
  </li>`;
}
