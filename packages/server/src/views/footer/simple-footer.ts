import { Link } from 'decorator-shared/types';
import html from 'decorator-shared/html';
import cls from 'decorator-shared/utilities.module.css';
import classes from 'decorator-client/src/styles/simple-footer.module.css';
import { ScreenshareButton } from './screenshare-button';
import { Features } from '../../unleash-service';

export type SimpleFooterProps = {
  links: Link[];
  texts: {
    share_screen: string;
  };
  features: Features;
};

export const SimpleFooter = ({
  links,
  texts,
  features,
}: SimpleFooterProps) => html`
  <footer class="${classes.simpleFooter}">
    <div class="${classes.simpleFooterContent} ${cls.contentContainer}">
      <div class="${classes.footerLinkList}">
        ${links.map(
          ({ content, url }) => html`
            <a class="${classes.footerLink}" href="${url}">${content}</a>
          `,
        )}
      </div>
      ${features['dekoratoren.skjermdeling'] &&
      ScreenshareButton(texts.share_screen)}
    </div>
  </footer>
`;
