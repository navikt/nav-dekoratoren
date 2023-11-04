import { ClientTexts } from 'decorator-shared/types';
import feedbackClasses from '../styles/feedback.module.css';
import { FeedbackSuccess } from '../views/feedback-success';

export function addFeedbackListener({ texts }: { texts: ClientTexts }) {
  // Feedback
  const buttons = document.querySelectorAll(
    `.${feedbackClasses.feedbackContent} button`,
  );

  buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      const feedbackContent = document.querySelector(
        `.${feedbackClasses.feedbackContent}`,
      );

      const answer = button.getAttribute('data-answer');

      if (feedbackContent) {
        feedbackContent.innerHTML = FeedbackSuccess({
          texts,
        }).render();

        window.logAmplitudeEvent('tilbakemelding', {
          kilde: 'footer',
          svar: answer,
        });
      }
    });
  });
}
