import cls from '../styles/feedback.module.css';

import type { Texts } from 'decorator-shared/types';
import html from 'decorator-shared/html';

export type FeedbackSuccessProps = { texts: Texts };

export function FeedbackSuccess({ texts }: FeedbackSuccessProps) {
  return html`
    <div class="${cls.feedbackSuccess}">
      <h2 class="${cls.feedbackTitle}">${texts.send_undersokelse_takk}</h2>
      <div>${texts.hensikt_med_tilbakemelding}</div>
      <a class="${cls.link}" href="/kontaktoss">
        ${texts.hensikt_med_tilbakemelding_lenke}
      </a>
    </div>
  `;
}
