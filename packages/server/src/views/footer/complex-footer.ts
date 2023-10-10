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
  features?: Features;
};

// <a class="footer-link" href="${url}">${content}</a>
export function ComplexFooter({ texts, links }: ComplexFooterProps) {
  // const isScreensharingEnabled = features['dekoratoren.skjermdeling'];
  return html`
    <footer class="footer" data-theme="dark">
      <div class="footer-content ${cls.contentContainer}">
        <a class="to-top-link" href="#"> ${ArrowUp()} ${texts.to_top} </a>

        <div class="footer-links">
          <ul class="footer-link-list">
            ${links.map(
              ({ heading, children }) => html`
                <li class="footer-link-group">
                  ${heading &&
                  html`<h2 class="footer-link-heading">${heading}</h2>`}
                  <ul>
                    ${children.map(
                      (link) => html`
                        <li class="footer-link-item">
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
            <li>${ScreenshareButton(texts.share_screen)}</li>
          </ul>
        </div>

        <div class="complex-footer-org">
          <img src="/public/ikoner/meny/nav-logo-white.svg" alt="NAV-logo" />
          <span>Arbeids- og velferdsetaten</span>
        </div>
      </div>
    </footer>
  `;
}
