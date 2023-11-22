import html from 'decorator-shared/html';
import cls from '@styles/feedback.module.json';
import { Texts } from 'decorator-shared/types';
import { Button } from 'decorator-shared/views/components/button';

export type FeedbackProps = {
  texts: Texts;
};

export const Feedback = ({ texts }: FeedbackProps) => html`
  <div class="${cls.feedback}">
    <div class="${cls.feedbackContent}">
      <h2 class="${cls.feedbackTitle}">${texts.did_you_find}</h2>
      <div class="${cls.buttonWrapper}">
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
`;
