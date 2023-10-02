import html from 'decorator-shared/html';

import classes from 'decorator-client/src/styles/feedback.module.css';
import { Texts } from 'decorator-shared/types';

export function Feedback({ texts }: { texts: Texts }) {
  return html`
    <div class="${classes.feedback}">
      <div class="${classes.feedbackContent}">
        <h2 class="${classes.feedbackTitle}">${texts.did_you_find}</h2>
        <div class="mx-4">
          <div class="button-wrapper small-gap">
            <button
              class="button button-outline wide big-label"
              id="feedback-yes"
              ,
              data-answer="${texts.yes}"
            >
              ${texts.yes}
            </button>
            <button
              class="button button-outline wide big-label"
              id="feedback-no"
              data-answer="${texts.no}"
            >
              ${texts.no}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
