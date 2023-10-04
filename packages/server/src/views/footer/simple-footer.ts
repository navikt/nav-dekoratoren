import { Link } from 'decorator-shared/types';
import html from 'decorator-shared/html';
import cls from 'decorator-shared/utilities.module.css';
import classes from 'decorator-client/src/styles/simple-footer.module.css';
import { ScreenshareButton } from './screenshare-button';

export type SimpleFooterProps = {
  links: Link[];
  texts: {
    share_screen: string;
  };
};

export const SimpleFooter = ({ links, texts }: SimpleFooterProps) => html`
  <footer class="${classes.simpleFooter}">
    <div class="${classes.simpleFooterContent} ${cls.contentContainer}">
      <div class="${classes.footerLinkList}">
        ${links.map(
          ({ content, url }) => html`
            <a class="${classes.footerLink}" href="${url}">${content}</a>
          `,
        )}
      </div>
      ${ScreenshareButton(texts.share_screen)}
    </div>
  </footer>
`;
