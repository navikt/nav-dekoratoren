import { Link } from 'decorator-shared/types';
import html from 'decorator-shared/html';

export type SimpleFooterProps = { links: Link[] };

export const SimpleFooter = ({ links }: SimpleFooterProps) => html`
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
