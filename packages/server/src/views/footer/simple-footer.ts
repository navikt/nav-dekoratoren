import { Link } from 'decorator-shared/types';
import html from 'decorator-shared/html';

export const SimpleFooter = ({ links }: { links: Link[] }) => html`
  <footer class="simple-footer">
    <ul class="footer-link-list">
      ${links.map(
        ({ content, url }) => html`
          <li>
            <a class="footer-link" href="${url}">${content}</a>
          </li>
        `,
      )}
    </ul>
  </footer>
`;
