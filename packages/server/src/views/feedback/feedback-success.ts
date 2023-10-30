import cls from 'decorator-client/src/styles/feedback.module.css';
import { z } from 'zod';

import html from 'decorator-shared/html';


// @NOTE: this is probably a good pattern either way. Because we can always extract the type, but not the other way around.
export const feedbackSchema = z.object({
    texts: z.object({
        send_undersokelse_takk: z.string(),
        hensikt_med_tilbakemelding: z.string(),
        hensikt_med_tilbakemelding_lenke: z.string(),
    }),
});

export type FeedbackSuccessProps = z.infer<typeof feedbackSchema>;

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
