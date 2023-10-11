import html from 'decorator-shared/html';

import classes from 'decorator-client/src/styles/feedback.module.css';
import { Texts } from 'decorator-shared/types';
import { Button } from 'decorator-shared/views/components/button';

export type FeedbackProps = {
  texts: Texts;
};

export function Feedback({ texts }: FeedbackProps) {
  return html`
    <div class="${classes.feedback}">
      <div class="${classes.feedbackContent}">
        <h2 class="${classes.feedbackTitle}">${texts.did_you_find}</h2>
        <div class="mx-4">
          <div class="button-wrapper small-gap">
            ${Button({
              text: texts.yes,
              variant: 'outline',
              wide: true,
              bigLabel: true,
              id: 'feedback-yes',
              data: { answer: texts.yes },
            })}
            ${Button({
              text: texts.no,
              variant: 'outline',
              wide: true,
              bigLabel: true,
              id: 'feedback-no',
              data: { answer: texts.no },
            })}
          </div>
        </div>
      </div>
    </div>
  `;
}
