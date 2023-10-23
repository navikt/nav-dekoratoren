import cls from 'decorator-client/src/styles/feedback.module.css';
import { z } from 'zod';

import html, { Template } from 'decorator-shared/html';

export type ServerView = {
    name: string;
    view: Template;
    schema: z.ZodObject<any, any>;
}

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
