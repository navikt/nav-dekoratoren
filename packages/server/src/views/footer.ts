import type { Params } from 'decorator-shared/params';
import { Node } from 'decorator-shared/types';
import html from 'decorator-shared/html';
import { Texts } from 'decorator-shared/texts';
import { ComplexFooter } from './complex-footer';
import { Button } from 'decorator-shared/views/components/button';
import { SimpleFooter } from './simple-footer';

export type FooterProps = {
  texts: Texts;
  personvern?: Node[];
  footerLinks?: Node[];
} & Pick<Params, 'simple' | 'feedback' | 'logoutWarning'>;

function getFooter(props: FooterProps) {
  if (props.simple) {
    return SimpleFooter(props);
  }
  return ComplexFooter(props);
}

function LogoutWarning() {
  return html`<dialog class="modal" id="logout-warning">
    <div class="modal-window">
      <h1 id="logout-warning-title" class="modal-title">
        Du blir snart logget ut automatisk
      </h1>
      <p id="logout-warning-body" class="modal-body">
        Vil du fortsatt være innlogget?
      </p>
      <div class="button-wrapper">
        <button
          class="button button-main big-label"
          id="logout-warning-confirm"
        >
          Ja
        </button>
        <button
          class="button button-secondary big-label"
          id="logout-warning-cancel"
        >
          Logg ut
        </button>
      </div>
    </div>
  </dialog>`;
}

function Feedback({ texts }: { texts: Texts }) {
  return html`
    <div id="feedback">
      <div class="feedback-content">
        <h2>${texts.did_you_find}</h2>
        <div class="mx-4">
          ${Button({ text: 'Ja' })} ${Button({ text: 'Nei' })}
        </div>
      </div>
      <script></script>
    </div>
  `;
}

export function Footer(props: FooterProps) {
  const footer = getFooter(props);

  // Remember to look in the footer for the proper structure
  return html`
    <div id="footer-withmenu" class="bg-white">
      ${props.feedback && Feedback({ texts: props.texts })}
      ${props.logoutWarning && LogoutWarning()} ${footer}
    </div>
  `;
}
