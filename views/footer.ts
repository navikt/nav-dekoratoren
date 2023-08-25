import type { Params } from '../params';
import { FooterLinks, Personvern, html } from '@/utils';
import { Texts } from '../texts';
import { ComplexFooter } from './complex-footer';
import { Feedback } from './feedback';
import { SimpleFooter } from './simple-footer';

export type FooterProps = {
  texts: Texts;
  personvern: Personvern;
  footerLinks: FooterLinks;
} & Pick<Params, 'simple' | 'feedback'>;

function getFooter(props: FooterProps) {
  if (props.simple) {
    return SimpleFooter(props);
  }
  return ComplexFooter(props);
}

export function Footer(props: FooterProps) {
  const footer = getFooter(props);

  // Remember to look in the footer for the proper structure
  return html`
    <div id="footer-withmenu" class="bg-white">
      ${props.feedback && Feedback({ texts: props.texts })} ${footer}
    </div>
  `;
}
