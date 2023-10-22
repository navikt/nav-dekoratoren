import { Link } from 'decorator-shared/types';
import html from 'decorator-shared/html';
import { ScreenshareButton } from './screenshare-button';
import { Features } from '../../unleash-service';
import { LenkeMedSporing } from 'decorator-shared/views/lenke-med-sporing-helpers';
import cls from 'decorator-client/src/styles/simple-footer.module.css';
import utilCls from 'decorator-shared/utilities.module.css';

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
  <footer class="${cls.simpleFooter}">
    <div class="${cls.simpleFooterContent} ${utilCls.contentContainer}">
      <div class="${cls.footerLinkList}">
        ${links.map(({ url, content }) =>
          LenkeMedSporing({
            href: url,
            children: content,
            className: cls.footerLink,
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
