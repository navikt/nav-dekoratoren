import utilsStyles from 'decorator-client/src/styles/utils.module.css';
import feedbackClasses from '../styles/feedback.module.css';

import type { Texts } from 'decorator-shared/types';
import html from 'decorator-shared/html';

export function FeedbackSuccess({ texts }: { texts: Texts }) {
  return html`
    <div class="${utilsStyles.textCenter}">
      <h2 class="${feedbackClasses.feedbackTitle}">
        ${texts.send_undersokelse_takk}
      </h2>
      <p class="my-1">${texts.hensikt_med_tilbakemelding}</p>
      <a class="basic-link my-1" href="/kontaktoss"
        >${texts.hensikt_med_tilbakemelding_lenke}</a
      >
    </div>
  `;
}
