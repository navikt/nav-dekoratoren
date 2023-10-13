import { LinkGroup, Texts } from 'decorator-shared/types';
import cls from 'decorator-shared/utilities.module.css';
import html from 'decorator-shared/html';
import { ScreenshareButton } from './screenshare-button';
import { ArrowUp } from 'decorator-shared/views/icons';

import classes from 'decorator-client/src/styles/complex-footer.module.css';
import { FooterLenke } from './lenke';
import { Features } from '../../unleash-service';

export type ComplexFooterProps = {
  texts: Pick<Texts, 'share_screen' | 'to_top'>;
  links: LinkGroup[];
  features: Features;
};

export function ComplexFooter({ texts, links, features }: ComplexFooterProps) {
  const isScreensharingEnabled = features['dekoratoren.skjermdeling'];

  return html`
    <footer class="${classes.footer}" data-theme="dark">
      <div class="${classes.footerContent} ${cls.contentContainer}">
        <a class="${classes.toTopLink}" href="#">
          ${ArrowUp()} ${texts.to_top}
        </a>

        <div class="${classes.footerLinks}">
          <ul class="${classes.footerLinkList}">
            ${links.map(
              ({ heading, children }) => html`
                <li class="${classes.footerLinkGroup}">
                  ${heading &&
                  html`<h2 class="${classes.footerLinkHeading}">
                    ${heading}
                  </h2>`}
                  <ul class="${classes.footerInnerLinkList}">
                    ${children.map(
                      (link) => html`
                        <li>
                          ${FooterLenke({
                            link,
                            classNameOverride: classes.footerLink,
                          })}
                        </li>
                      `,
                    )}
                  </ul>
                </li>
              `,
            )}
            ${isScreensharingEnabled &&
            html`<li>${ScreenshareButton(texts.share_screen)}</li>`}
          </ul>
        </div>

        <div class="${classes.complexFooterOrg}">
          <img src="/public/ikoner/meny/nav-logo-white.svg" alt="NAV-logo" />
          <span>Arbeids- og velferdsetaten</span>
        </div>
      </div>
    </footer>
  `;
}
