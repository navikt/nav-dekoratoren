import { Link } from 'decorator-shared/types';
import html from 'decorator-shared/html';
import classes from 'decorator-client/src/styles/simple-footer.module.css';
import './wat.css';

export type SimpleFooterProps = { links: Link[] };

export const SimpleFooter = ({ links }: SimpleFooterProps) => html`
  <footer class="${classes.simpleFooter}">
    <ul class="${classes.footerLinkList}">
      ${links.map(
        ({ content, url }) => html`
          <li>
            <a class="${classes.footerLink}" href="${url}">${content}</a>
          </li>
        `,
      )}
    </ul>
  </footer>
`;
