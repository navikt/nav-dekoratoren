import { Link } from 'decorator-shared/types';
import html from 'decorator-shared/html';
import cls from 'decorator-shared/utilities.module.css';
import classes from 'decorator-client/src/styles/simple-footer.module.css';
import { ScreenshareButton } from './screenshare-button';
import { Features } from '../../unleash-service';
import { LenkeMedSporing } from 'decorator-shared/views/lenke-med-sporing-helpers';

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
        ${links.map(({ url, content }) =>
          LenkeMedSporing({
            href: url,
            children: content,
            className: classes.footerLink,
            analyticsEventArgs: {
              category: 'dekorator-footer',
              action: `kontakt/${url}`,
              label: url,
            },
          }),
        )}
      </div>
      ${features['dekoratoren.skjermdeling'] &&
      ScreenshareButton(texts.share_screen)}
    </div>
  </footer>
`;
